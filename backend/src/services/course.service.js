import prisma from '../config/database.js';

export async function listCourses({
  category,
  level,
  status = 'PUBLISHED',
  instructorId,
  search,
  page = 1,
  limit = 10,
  user = null,
}) {
  const where = {};

  // Status authorization:
  // Non-admins and unauthenticated users can ONLY see PUBLISHED or APPROVED courses.
  // Instructors can see their own courses in any status if querying with their own instructorId.
  const isAdmin = user?.role === 'ADMIN';
  const isOwnerInstructor = user?.role === 'INSTRUCTOR' && instructorId && instructorId === user.id;

  if (isAdmin) {
    if (status && status !== 'ALL') where.status = status;
  } else if (isOwnerInstructor) {
    if (status && status !== 'ALL') where.status = status;
    where.instructorId = user.id;
  } else {
    // Public / student / company: strictly PUBLISHED (or APPROVED) courses only.
    // status=ALL or status=DRAFT cannot expose unpublished courses to non-admins.
    if (status === 'APPROVED') {
      where.status = 'APPROVED';
    } else {
      where.status = { in: ['PUBLISHED', 'APPROVED'] };
    }
  }

  if (instructorId && !where.instructorId) where.instructorId = instructorId;
  if (category) where.category = category;
  if (level) where.level = level;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Cap limit between 1 and 100 to prevent denial of service
  const boundedLimit = Math.max(1, Math.min(Number(limit) || 10, 100));
  const boundedPage = Math.max(1, Number(page) || 1);

  const [total, courses] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      skip: (boundedPage - 1) * boundedLimit,
      take: boundedLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: {
          select: {
            id: true,
            // Strictly omit email to protect instructor privacy in public responses
            profile: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
        _count: { select: { chapters: true, enrollments: true } },
      },
    }),
  ]);

  const sanitizedCourses = courses.map((course) => {
    if (course.instructor && course.instructor.email) {
      delete course.instructor.email;
    }
    return course;
  });

  return { courses: sanitizedCourses, total, page: boundedPage, limit: boundedLimit, totalPages: Math.ceil(total / boundedLimit) };
}

export async function getCourseById(courseId, { user = null, includeContent = false } = {}) {
  // Support legacy boolean invocation if passed directly
  if (typeof user === 'boolean') {
    includeContent = user;
    user = null;
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!course) return null;

  const isAdmin = user?.role === 'ADMIN';
  const isOwner = user?.role === 'INSTRUCTOR' && course.instructorId === user.id;
  const isPrivileged = isAdmin || isOwner;

  // 1. Unpublished courses (DRAFT, PENDING_REVIEW, REJECTED) are strictly restricted to Admin & Owner
  const isAvailablePublicly = course.status === 'PUBLISHED' || course.status === 'APPROVED';
  if (!isAvailablePublicly && !isPrivileged) {
    return null;
  }

  // 2. Strip instructor email for non-privileged users
  if (!isPrivileged && course.instructor) {
    delete course.instructor.email;
  }

  // 3. Check enrollment if student is requesting content
  let enrollment = null;
  if (user && user.role === 'STUDENT' && includeContent) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
  }

  // 4. Sanitize chapters, lessons, and quizzes
  const sanitizedChapters = (course.chapters || []).map((chapter) => {
    // Freemium rules: Chapters 0-5 are free; Chapter 6+ requires coins / unlock
    const isFreeChapter = chapter.order <= 5;
    const isUnlocked = isPrivileged || Boolean(enrollment && enrollment.unlockedChapterIds?.includes(chapter.id));
    const canAccessContent = isPrivileged || (isFreeChapter && enrollment) || isUnlocked;

    // Sanitize chapter quiz: Strip correctAnswer and explanation for non-privileged users
    let sanitizedQuiz = chapter.quiz;
    if (sanitizedQuiz && typeof sanitizedQuiz === 'object' && !isPrivileged) {
      const questions = Array.isArray(sanitizedQuiz.questions)
        ? sanitizedQuiz.questions.map((q) => {
            const { correctAnswer, explanation, ...safeQ } = q;
            return safeQ;
          })
        : [];
      sanitizedQuiz = {
        ...sanitizedQuiz,
        questions,
      };
    }

    // Process lessons
    const sanitizedLessons = (chapter.lessons || []).map((lesson) => {
      if (includeContent && canAccessContent) {
        return lesson;
      }
      // If content not requested or access denied, strip content payload
      const { content, ...metaLesson } = lesson;
      return metaLesson;
    });

    return {
      ...chapter,
      quiz: sanitizedQuiz,
      lessons: sanitizedLessons,
      isLocked: !isFreeChapter && !isUnlocked,
    };
  });

  // 5. Sanitize finalAssessment: Strip correctAnswer and explanation for non-privileged users
  let sanitizedFinalAssessment = course.finalAssessment;
  if (sanitizedFinalAssessment && typeof sanitizedFinalAssessment === 'object' && !isPrivileged) {
    const questions = Array.isArray(sanitizedFinalAssessment.questions)
      ? sanitizedFinalAssessment.questions.map((q) => {
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        })
      : [];
    sanitizedFinalAssessment = {
      ...sanitizedFinalAssessment,
      questions,
    };
  }

  return {
    ...course,
    finalAssessment: sanitizedFinalAssessment,
    chapters: sanitizedChapters,
  };
}

export async function createCourse(instructorId, data) {
  return prisma.course.create({
    data: {
      ...data,
      instructorId,
      status: 'DRAFT',
    },
  });
}

export async function updateCourse(courseId, instructorId, data, isAdmin = false) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;
  if (!isAdmin && course.instructorId !== instructorId) {
    throw new Error('FORBIDDEN_NOT_OWNER');
  }

  const updatePayload = { ...data };
  // If an instructor modifies an approved/published course, reset status to PENDING_REVIEW
  if (!isAdmin && (course.status === 'APPROVED' || course.status === 'PUBLISHED')) {
    updatePayload.status = 'PENDING_REVIEW';
    updatePayload.reviewNote = 'Course modified by instructor; awaiting re-review.';
  }

  return prisma.course.update({
    where: { id: courseId },
    data: updatePayload,
  });
}

export async function addChapter(courseId, instructorId, chapterData) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;
  if (course.instructorId !== instructorId) throw new Error('FORBIDDEN_NOT_OWNER');

  // Enforce Freemium Product Rule: Chapters 0-5 are free; > 5 require Coins
  const isFree = chapterData.order <= 5 ? true : Boolean(chapterData.isFree === false ? false : chapterData.order <= 5);
  const coinsCost = isFree ? 0 : (chapterData.coinsCost > 0 ? chapterData.coinsCost : 50);

  const chapter = await prisma.chapter.create({
    data: {
      courseId,
      title: chapterData.title,
      order: chapterData.order,
      isFree,
      coinsCost,
    },
  });

  // Revert course status to PENDING_REVIEW if previously approved/published
  if (course.status === 'APPROVED' || course.status === 'PUBLISHED') {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        status: 'PENDING_REVIEW',
        reviewNote: 'New chapter added by instructor; awaiting re-review.',
      },
    });
  }

  return chapter;
}

export async function addLesson(chapterId, instructorId, lessonData) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter) return null;
  if (chapter.course.instructorId !== instructorId) throw new Error('FORBIDDEN_NOT_OWNER');

  const lesson = await prisma.lesson.create({
    data: {
      chapterId,
      title: lessonData.title,
      order: lessonData.order,
      duration: lessonData.duration || 10,
      content: lessonData.content || {},
    },
  });

  if (chapter.course.status === 'APPROVED' || chapter.course.status === 'PUBLISHED') {
    await prisma.course.update({
      where: { id: chapter.course.id },
      data: {
        status: 'PENDING_REVIEW',
        reviewNote: 'New lesson added by instructor; awaiting re-review.',
      },
    });
  }

  return lesson;
}

export async function deleteCourse(courseId, instructorId, isAdmin = false) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;
  if (!isAdmin && course.instructorId !== instructorId) {
    throw new Error('FORBIDDEN_NOT_OWNER');
  }

  return prisma.course.delete({
    where: { id: courseId },
  });
}

export async function updateChapter(chapterId, instructorId, chapterData, isAdmin = false) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter) return null;
  if (!isAdmin && chapter.course.instructorId !== instructorId) {
    throw new Error('FORBIDDEN_NOT_OWNER');
  }

  const dataToUpdate = { ...chapterData };
  if (dataToUpdate.order !== undefined) {
    const isFree = dataToUpdate.order <= 5 ? true : Boolean(dataToUpdate.isFree === false ? false : dataToUpdate.order <= 5);
    dataToUpdate.isFree = isFree;
    if (isFree) dataToUpdate.coinsCost = 0;
  }

  const updatedChapter = await prisma.chapter.update({
    where: { id: chapterId },
    data: dataToUpdate,
  });

  if (!isAdmin && (chapter.course.status === 'APPROVED' || chapter.course.status === 'PUBLISHED')) {
    await prisma.course.update({
      where: { id: chapter.course.id },
      data: {
        status: 'PENDING_REVIEW',
        reviewNote: 'Chapter modified by instructor; awaiting re-review.',
      },
    });
  }

  return updatedChapter;
}

export async function updateLesson(lessonId, instructorId, lessonData, isAdmin = false) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });
  if (!lesson || !lesson.chapter || !lesson.chapter.course) return null;
  if (!isAdmin && lesson.chapter.course.instructorId !== instructorId) {
    throw new Error('FORBIDDEN_NOT_OWNER');
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: lessonData,
  });

  if (!isAdmin && (lesson.chapter.course.status === 'APPROVED' || lesson.chapter.course.status === 'PUBLISHED')) {
    await prisma.course.update({
      where: { id: lesson.chapter.course.id },
      data: {
        status: 'PENDING_REVIEW',
        reviewNote: 'Lesson modified by instructor; awaiting re-review.',
      },
    });
  }

  return updatedLesson;
}

export async function submitForReview(courseId, instructorId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { chapters: { include: { lessons: true } } },
  });
  if (!course) return null;
  if (course.instructorId !== instructorId) throw new Error('FORBIDDEN_NOT_OWNER');

  if (course.chapters.length === 0) {
    throw new Error('CANNOT_SUBMIT_EMPTY_COURSE: Course must contain at least one chapter');
  }

  return prisma.course.update({
    where: { id: courseId },
    data: { status: 'PENDING_REVIEW' },
  });
}

export async function reviewCourseDecision(courseId, { status, reviewNote }) {
  return prisma.course.update({
    where: { id: courseId },
    data: {
      status, // APPROVED or REJECTED
      reviewNote,
    },
  });
}
