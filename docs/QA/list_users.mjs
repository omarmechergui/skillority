import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          university: true,
          major: true,
          companyName: true,
          expertise: true,
        }
      },
      wallet: {
        select: {
          balance: true
        }
      }
    }
  });
  console.log(`--- TOTAL DATABASE USERS: ${users.length} ---`);
  users.forEach(u => {
    console.log(`[${u.role}] ${u.email} | ID: ${u.id} | Active: ${u.isActive} | Balance: ${u.wallet?.balance}`);
  });
}

main()
  .catch(e => console.error('DB ERROR:', e.message))
  .finally(() => prisma.$disconnect());
