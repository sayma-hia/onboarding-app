import type { OnboardingFormData } from './types';
import { isNonEmpty, isValidEmail, lengthError, type LengthLimits } from './validation';

// one place that owns the actual error copy per field, so steps.ts's
// isValid() and each screen's inline messages can never drift apart

// a step is valid once its error-producing function stops reporting any
export function hasNoErrors(errors: object): boolean {
  return Object.keys(errors).length === 0;
}

// shared shape for feeding a field's error into an MUI input - screens
// only reveal it once the user has tried to advance (attemptedAdvance)
export function fieldErrorProps(attemptedAdvance: boolean, message?: string) {
  return {
    error: attemptedAdvance && !!message,
    helperText: attemptedAdvance ? message : undefined,
  };
}

// turns the same limits used for the error message into the native HTML
// constraints MUI forwards to the underlying <input> via slotProps - the
// browser enforces max length live instead of only failing after submit
export function lengthSlotProps(limits: LengthLimits) {
  return {
    slotProps: {
      htmlInput: {
        ...(limits.min !== undefined ? { minLength: limits.min } : {}),
        ...(limits.max !== undefined ? { maxLength: limits.max } : {}),
      },
    },
  };
}

// character limits per field - the single source both the error copy
// and the input's native maxLength/minLength are derived from
export const FIELD_LIMITS = {
  firstName: { min: 2, max: 50 },
  lastName: { min: 2, max: 50 },
  email: { max: 254 },
  jobTitle: { min: 2, max: 100 },
  phone: { min: 7, max: 20 },
  companyName: { min: 2, max: 100 },
} as const satisfies Record<string, LengthLimits>;

function requiredTextError(label: string, value: string, limits: LengthLimits): string | undefined {
  if (!isNonEmpty(value)) return `${label} is required`;
  return lengthError(label, value, limits);
}

function optionalTextError(label: string, value: string, limits: LengthLimits): string | undefined {
  if (!isNonEmpty(value)) return undefined;
  return lengthError(label, value, limits);
}

export interface PersonalInfoErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function personalInfoErrors(data: OnboardingFormData): PersonalInfoErrors {
  const errors: PersonalInfoErrors = {};
  const { firstName, lastName, email } = data.personalInfo;

  const firstNameError = requiredTextError('First name', firstName, FIELD_LIMITS.firstName);
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = requiredTextError('Last name', lastName, FIELD_LIMITS.lastName);
  if (lastNameError) errors.lastName = lastNameError;

  let emailError = requiredTextError('Email', email, FIELD_LIMITS.email);
  if (!emailError && !isValidEmail(email)) emailError = 'Enter a valid email address';
  if (emailError) errors.email = emailError;

  return errors;
}

export interface AccountTypeErrors {
  type?: string;
}

export function accountTypeErrors(data: OnboardingFormData): AccountTypeErrors {
  return data.accountType.type === '' ? { type: 'Select an account type' } : {};
}

export interface PersonalDetailsErrors {
  jobTitle?: string;
  phone?: string;
}

export function personalDetailsErrors(data: OnboardingFormData): PersonalDetailsErrors {
  const errors: PersonalDetailsErrors = {};
  const { jobTitle, phone } = data.personalDetails;

  const jobTitleError = requiredTextError('Job title', jobTitle, FIELD_LIMITS.jobTitle);
  if (jobTitleError) errors.jobTitle = jobTitleError;

  const phoneError = optionalTextError('Phone', phone, FIELD_LIMITS.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
}

export interface CompanyDetailsErrors {
  companyName?: string;
  companyType?: string;
}

export function companyDetailsErrors(data: OnboardingFormData): CompanyDetailsErrors {
  const errors: CompanyDetailsErrors = {};
  const { companyName, companyType } = data.companyDetails;

  const companyNameError = requiredTextError('Company name', companyName, FIELD_LIMITS.companyName);
  if (companyNameError) errors.companyName = companyNameError;

  if (!isNonEmpty(companyType)) errors.companyType = 'Company type is required';

  return errors;
}

export interface TeamSizeErrors {
  size?: string;
}

export function teamSizeErrors(data: OnboardingFormData): TeamSizeErrors {
  return isNonEmpty(data.teamSize.size) ? {} : { size: 'Select a team size' };
}
