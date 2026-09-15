const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export interface LengthLimits {
  min?: number;
  max?: number;
}

// generic min/max length check, reused by every text field's error
// function instead of each one re-deriving its own character count logic
export function lengthError(label: string, value: string, limits: LengthLimits): string | undefined {
  const length = value.trim().length;
  if (limits.min !== undefined && length < limits.min) {
    return `${label} must be at least ${limits.min} characters`;
  }
  if (limits.max !== undefined && length > limits.max) {
    return `${label} must be ${limits.max} characters or fewer`;
  }
  return undefined;
}
