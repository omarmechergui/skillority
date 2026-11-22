import prisma from '../config/database.js';

export async function listCourses({ category, level, status = 'PUBLISHED', instructorId, search, page = 1, limit = 10 }) {
  const where = {};
  if (status && status !== 'ALL') where.status = status;
  if (instructorId) where.instructorId = instructorId;
  if (category) where.category = category;
  if (level) where.level = level;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, courses] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
        _count: { select: { chapters: true, enrollments: true } },
      },
    }),
  ]);

  return { courses, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCourseById(courseId, includeFullCurriculum = false) {
  return prisma.course.findUnique({
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
          lessons: includeFullCurriculum
            ? { orderBy: { order: 'asc' } }
            : { select: { id: true, title: true, order: true, duration: true } },
        },
      },
    },
  });
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

  return prisma.course.update({
    where: { id: courseId },
    data,
  });
}

export async function addChapter(courseId, instructorId, chapterData) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;
  if (course.instructorId !== instructorId) throw new Error('FORBIDDEN_NOT_OWNER');

  // Enforce Freemium Product Rule: Chapters 0-5 are free; > 5 require Coins
  const isFree = chapterData.order <= 5 ? true : Boolean(chapterData.isFree === false ? false : chapterData.order <= 5);
  const coinsCost = isFree ? 0 : (chapterData.coinsCost > 0 ? chapterData.coinsCost : 50);

  return prisma.chapter.create({
    data: {
      courseId,
      title: chapterData.title,
      order: chapterData.order,
      isFree,
      coinsCost,
    },
  });
}

export async function addLesson(chapterId, instructorId, lessonData) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter) return null;
  if (chapter.course.instructorId !== instructorId) throw new Error('FORBIDDEN_NOT_OWNER');

  return prisma.lesson.create({
    data: {
      chapterId,
      title: lessonData.title,
      order: lessonData.order,
      duration: lessonData.duration || 10,
      content: lessonData.content || {},
    },
  });
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

  return prisma.chapter.update({
    where: { id: chapterId },
    data: dataToUpdate,
  });
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

  return prisma.lesson.update({
    where: { id: lessonId },
    data: lessonData,
  });
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
