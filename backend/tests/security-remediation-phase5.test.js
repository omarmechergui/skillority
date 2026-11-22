import assert from 'assert';
import * as careerService from '../src/services/career.service.js';
import * as messagingService from '../src/services/messaging.service.js';
import * as communityService from '../src/services/community.service.js';
import prisma from '../src/config/database.js';

async function runPhase5Tests() {
  console.log('=== STARTING PHASE 5: FINAL SECURITY AUDIT & TARGETED REMEDIATION TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // 1. RECRUITMENT DATA LEAKAGE: WITHDRAW APPLICATION PRIVACY
  // --------------------------------------------------------------------------
  await test('1. Candidate Application Withdrawal: Strips private recruiter internalNotes and rating', async () => {
    const studentId = 'student_privacy_1';
    const applicationId = 'app_privacy_1';
    const companyId = 'company_recruiter_1';

    let updatedApplication = null;
    let timelineCreated = false;

    prisma.application.findUnique = async ({ where }) => {
      if (where.id === applicationId) {
        return {
          id: applicationId,
          studentId,
          status: 'PENDING',
          notes: 'Candidate applied',
          internalNotes: 'TOP_SECRET: Candidate performed poorly in background check. Do not hire.',
          rating: 1,
          opportunity: { id: 'opp_1', title: 'Software Engineer', companyId },
        };
      }
      return null;
    };

    prisma.application.update = async ({ where, data }) => {
      updatedApplication = {
        id: applicationId,
        studentId,
        status: data.status,
        withdrawnAt: data.withdrawnAt,
        notes: data.notes,
        internalNotes: 'TOP_SECRET: Candidate performed poorly in background check. Do not hire.',
        rating: 1,
      };
      return updatedApplication;
    };

    prisma.applicationTimeline.create = async () => {
      timelineCreated = true;
      return { id: 'tl_1' };
    };

    prisma.notification.create = async () => ({ id: 'notif_1' });

    const result = await careerService.withdrawApplication(studentId, applicationId, 'Found another opportunity');

    assert.ok(result, 'Expected result to be returned');
    assert.strictEqual(result.status, 'WITHDRAWN');
    assert.strictEqual(result.internalNotes, undefined, 'Confidential internalNotes MUST be stripped from student response');
    assert.strictEqual(result.rating, undefined, 'Private recruiter rating MUST be stripped from student response');
    assert.strictEqual(timelineCreated, true, 'Audit timeline must be preserved');
  });

  // --------------------------------------------------------------------------
  // 2. MESSAGING SECURITY: IDOR & THREAD INJECTION
  // --------------------------------------------------------------------------
  await test('2. Messaging Guard: Rejects sending message to oneself with 400 CANNOT_MESSAGE_SELF', async () => {
    try {
      await messagingService.sendMessage('user_123', 'conv_123', 'user_123', 'Hello myself');
      assert.fail('Should have thrown error for self-messaging');
    } catch (err) {
      assert.strictEqual(err.message, 'CANNOT_MESSAGE_SELF');
      assert.strictEqual(err.statusCode, 400);
    }
  });

  await test('3. Messaging Guard: Prevents third-party injection into existing conversation thread (IDOR protection)', async () => {
    const existingConversationId = 'conv_alice_bob';
    
    prisma.message.findFirst = async ({ where }) => {
      if (where.conversationId === existingConversationId) {
        return {
          id: 'msg_1',
          conversationId: existingConversationId,
          senderId: 'user_alice',
          recipientId: 'user_bob',
        };
      }
      return null;
    };

    try {
      // Eve attempts to inject a message into Alice and Bob's thread
      await messagingService.sendMessage('user_eve', existingConversationId, 'user_bob', 'Injected eavesdropped text');
      assert.fail('Should have blocked non-participant user from injecting into thread');
    } catch (err) {
      assert.strictEqual(err.message, 'FORBIDDEN_NOT_PARTICIPANT');
      assert.strictEqual(err.statusCode, 403);
    }
  });

  await test('4. Messaging Guard: Legitimate participants can send messages in conversation', async () => {
    const existingConversationId = 'conv_alice_bob';
    let messageCreated = false;

    prisma.message.findFirst = async ({ where }) => {
      if (where.conversationId === existingConversationId) {
        return {
          id: 'msg_1',
          conversationId: existingConversationId,
          senderId: 'user_alice',
          recipientId: 'user_bob',
        };
      }
      return null;
    };

    prisma.message.create = async ({ data }) => {
      messageCreated = true;
      return { id: 'msg_2', ...data, createdAt: new Date() };
    };

    const msg = await messagingService.sendMessage('user_bob', existingConversationId, 'user_alice', 'Hi Alice, received your note.');
    assert.strictEqual(messageCreated, true);
    assert.strictEqual(msg.senderId, 'user_bob');
    assert.strictEqual(msg.recipientId, 'user_alice');
  });

  // --------------------------------------------------------------------------
  // 3. COMMUNITY PAGINATION & COMMENT INTEGRITY
  // --------------------------------------------------------------------------
  await test('5. Community Pagination: Enforces bounded page and limit to prevent memory exhaustion DoS', async () => {
    let capturedQuery = null;

    prisma.communityPost.count = async () => 100;
    prisma.communityPost.findMany = async (args) => {
      capturedQuery = args;
      return [];
    };

    // User attempts unbounded query with limit=500000 and negative page=-5
    const result = await communityService.listPosts({ page: -5, limit: 500000 });

    assert.strictEqual(result.page, 1, 'Page should be clamped to >= 1');
    assert.strictEqual(result.limit, 50, 'Limit should be clamped to maximum 50');
    assert.strictEqual(capturedQuery.take, 50, 'Prisma take must be bounded');
    assert.strictEqual(capturedQuery.skip, 0, 'Prisma skip must be non-negative');
  });

  await test('6. Community Comment Integrity: Rejects comment on non-existent post with 404 POST_NOT_FOUND', async () => {
    prisma.communityPost.findUnique = async () => null;

    try {
      await communityService.addComment('non_existent_post_id', 'author_1', 'Great article!');
      assert.fail('Should have rejected comment on missing post');
    } catch (err) {
      assert.strictEqual(err.message, 'POST_NOT_FOUND');
      assert.strictEqual(err.statusCode, 404);
    }
  });

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log(`\n=== PHASE 5 TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
