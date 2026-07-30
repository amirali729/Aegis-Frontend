/**
 * ApiError normalizes every failed backend response into one shape.
 *
 * The backend's error envelope is:
 * { success: false, statusCode, message, timestamp }
 *
 * Validation errors may pack multiple field errors into `message` as a
 * semicolon-separated string, e.g.:
 *   "email: Must be a valid email address.; password: Password must be at least 8 characters."
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly timestamp: string;
  readonly fieldErrors: Record<string, string>;

  constructor(params: {
    message: string;
    statusCode: number;
    timestamp?: string;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.statusCode = params.statusCode;
    this.timestamp = params.timestamp ?? new Date().toISOString();
    this.fieldErrors = parseFieldErrors(params.message);
  }

  get isValidation() {
    return this.statusCode === 400;
  }

  get isUnauthorized() {
    return this.statusCode === 401;
  }

  get isForbidden() {
    return this.statusCode === 403;
  }

  get isNotFound() {
    return this.statusCode === 404;
  }

  get isConflict() {
    return this.statusCode === 409;
  }

  get isGone() {
    return this.statusCode === 410;
  }

  get isLocked() {
    return this.statusCode === 423;
  }

  get isRateLimited() {
    return this.statusCode === 429;
  }

  get isServerError() {
    return this.statusCode >= 500;
  }
}

/**
 * Splits a "field: message; field: message" string into a lookup map.
 * Falls back to an empty object if the message doesn't match that shape,
 * which is the common case for non-validation errors.
 */
function parseFieldErrors(message: string): Record<string, string> {
  if (!message.includes(":") || !message.includes(";")) {
    // Still try a single "field: message" case with no semicolon.
    const singleMatch = /^([a-zA-Z0-9_.]+):\s*(.+)$/.exec(message.trim());
    if (singleMatch) return { [singleMatch[1]]: singleMatch[2] };
    return {};
  }

  const result: Record<string, string> = {};
  const segments = message.split(";").map((segment) => segment.trim());

  for (const segment of segments) {
    const match = /^([a-zA-Z0-9_.]+):\s*(.+)$/.exec(segment);
    if (match) {
      result[match[1]] = match[2];
    }
  }

  return result;
}