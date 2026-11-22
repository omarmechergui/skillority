/**
 * Name parsing utilities for user onboarding and profiles.
 */

const TITLES_REGEX = /^(dr\.?|prof\.?|professor|mr\.?|mrs\.?|ms\.?|mx\.?|doctor)$/i;

/**
 * Parses full name into firstName and lastName, safely handling titles/honorifics
 * and preserving existing profile names when appropriate.
 *
 * @param {string} name - Input full name string
 * @param {object|null} existingProfile - Existing user profile (optional)
 * @returns {{ firstName: string|undefined, lastName: string|undefined }}
 */
export function parseInstructorName(name, existingProfile = null) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return {
      firstName: existingProfile?.firstName || undefined,
      lastName: existingProfile?.lastName || undefined,
    };
  }

  const rawTokens = name.trim().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) {
    return {
      firstName: existingProfile?.firstName || undefined,
      lastName: existingProfile?.lastName || undefined,
    };
  }

  // Remove leading title/honorific (e.g., "Dr.", "Prof.", "Dr", or compound "Prof. Dr.")
  let tokens = [...rawTokens];
  while (tokens.length > 0 && TITLES_REGEX.test(tokens[0])) {
    tokens.shift();
  }

  // If only a title was entered (e.g., "Dr."), do not overwrite with empty values; preserve existing
  if (tokens.length === 0) {
    return {
      firstName: existingProfile?.firstName || undefined,
      lastName: existingProfile?.lastName || undefined,
    };
  }

  const firstName = tokens[0];
  // If no last name in tokens, preserve existing lastName if available, else empty string
  const lastName =
    tokens.length > 1
      ? tokens.slice(1).join(' ')
      : existingProfile?.lastName ?? '';

  return { firstName, lastName };
}
