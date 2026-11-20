/**
 * Onboarding Utilities
 *
 * Centralizes onboarding-completion detection and role-based routing
 * decisions so that sign-in, AuthGuard, and onboarding pages share
 * a single source of truth.
 *
 * Completion is derived from the profile fields that the respective
 * onboarding forms populate — no extra schema field is required.
 */

/**
 * Role-to-dashboard mapping.
 */
export const ROLE_DASHBOARDS = {
  STUDENT: '/student/dashboard',
  COMPANY: '/company/dashboard',
  INSTRUCTOR: '/instructor/dashboard',
  ADMIN: '/admin/dashboard',
};

/**
 * Role-to-onboarding mapping.
 */
export const ROLE_ONBOARDING = {
  STUDENT: '/onboarding/student',
  COMPANY: '/onboarding/company',
  INSTRUCTOR: '/onboarding/instructor',
};

/**
 * Determine whether a user's onboarding profile is complete.
 *
 * Uses the same fields that each onboarding form requires:
 * - STUDENT  → university + major  (required fields in the student onboarding form)
 * - COMPANY  → companyName         (required field in the company onboarding form)
 * - INSTRUCTOR → expertise array populated OR experience text filled
 * - ADMIN    → no onboarding exists, always considered complete
 */
export function isOnboardingComplete(user) {
  if (!user) return false;

  const profile = user.profile;
  if (!profile) return false;

  switch (user.role) {
    case 'STUDENT':
      return !!(profile.university && profile.major);
    case 'COMPANY':
      return !!profile.companyName;
    case 'INSTRUCTOR':
      return !!(
        (Array.isArray(profile.expertise) && profile.expertise.length > 0) ||
        profile.experience
      );
    case 'ADMIN':
      return true;
    default:
      return false;
  }
}

/**
 * Determine where to send a user after successful login.
 *
 * Priority:
 * 1. Role-specific onboarding page (if onboarding is incomplete).
 *    Enforcement: Incomplete users MUST complete onboarding first before accessing protected routes.
 * 2. Safe and role-authorized `redirect` query parameter (for completed users).
 * 3. Role-specific dashboard (fallback for completed users).
 */
export function getPostLoginDestination(user, redirectParam) {
  if (!user) return '/auth/signin';

  const dashboard = ROLE_DASHBOARDS[user.role] || '/';
  const onboarding = ROLE_ONBOARDING[user.role];

  // 1. Incomplete onboarding ALWAYS takes precedence over redirect query
  if (onboarding && !isOnboardingComplete(user)) {
    return onboarding;
  }

  // 2. Completed user with a safe, role-authorized redirect target
  if (redirectParam) {
    try {
      const decoded = decodeURIComponent(redirectParam);
      if (isSafeRedirect(decoded) && isAuthorizedRedirect(user.role, decoded)) {
        return decoded;
      }
    } catch {
      // In case of malformed URI encoding, fall back to dashboard
    }
  }

  // 3. Completed user fallback: role dashboard
  return dashboard;
}

/**
 * Check if the destination path belongs to the user's allowed role scope.
 * Prevents cross-role destinations like student navigating to /admin/* or /company/*.
 */
export function isAuthorizedRedirect(role, path) {
  if (!path || typeof path !== 'string') return false;

  // Role path prefixes
  const rolePrefixes = {
    STUDENT: ['/student', '/onboarding/student'],
    COMPANY: ['/company', '/onboarding/company'],
    INSTRUCTOR: ['/instructor', '/onboarding/instructor'],
    ADMIN: ['/admin'],
  };

  const allowedPrefixes = rolePrefixes[role] || [];
  
  // Also permit general public routes like / or onboarding role selection
  if (path === '/' || path.startsWith('/onboarding/role')) {
    return true;
  }

  // Disallow forbidden role route groups
  const forbiddenPrefixes = Object.entries(rolePrefixes)
    .filter(([r]) => r !== role)
    .flatMap(([, prefixes]) => prefixes);

  if (forbiddenPrefixes.some(prefix => path.startsWith(prefix))) {
    return false;
  }

  return allowedPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Validate that a redirect path is safe (local-only, no open-redirect, no protocol relative, no javascript:).
 */
export function isSafeRedirect(path) {
  if (!path || typeof path !== 'string') return false;
  // Must start with a single slash (not //)
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  // Must not contain protocol indicators or javascript pseudo-protocol
  if (path.includes('://') || path.toLowerCase().includes('javascript:')) return false;
  return true;
}
