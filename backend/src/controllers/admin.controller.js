import * as adminService from '../services/admin.service.js';

export async function listUsers(req, res, next) {
  try {
    const { role, isActive, search, page, limit } = req.query;
    const result = await adminService.listUsers({
      role,
      isActive,
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    return res.status(200).json({ success: true, data: result.users, meta: result });
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'isActive must be a boolean' } });
    }

    const updated = await adminService.updateUserStatus(id, { isActive });
    return res.status(200).json({ success: true, message: `User status updated to ${isActive ? 'active' : 'suspended'}`, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function getReviewQueue(req, res, next) {
  try {
    const queue = await adminService.getCourseReviewQueue();
    return res.status(200).json({ success: true, data: queue });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await adminService.getPlatformStatistics();
    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
