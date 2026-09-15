import type { OnboardingFormData } from './types';
import { isNonEmpty, isValidEmail } from './validation';

// one place that owns the actual error copy per field, so steps.ts's
// isValid() and each screen's inline messages can never drift apart

export interface PersonalInfoErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function personalInfoErrors(data: OnboardingFormData): PersonalInfoErrors {
  const errors: PersonalInfoErrors = {};
  if (!isNonEmpty(data.personalInfo.firstName)) errors.firstName = 'First name is required';
  if (!isNonEmpty(data.personalInfo.lastName)) errors.lastName = 'Last name is required';
  if (!isNonEmpty(data.personalInfo.email)) errors.email = 'Email is required';
  else if (!isValidEmail(data.personalInfo.email)) errors.email = 'Enter a valid email address';
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
}

export function personalDetailsErrors(data: OnboardingFormData): PersonalDetailsErrors {
  return isNonEmpty(data.personalDetails.jobTitle) ? {} : { jobTitle: 'Job title is required' };
}

export interface CompanyDetailsErrors {
  companyName?: string;
  companyType?: string;
}

export function companyDetailsErrors(data: OnboardingFormData): CompanyDetailsErrors {
  const errors: CompanyDetailsErrors = {};
  if (!isNonEmpty(data.companyDetails.companyName)) errors.companyName = 'Company name is required';
  if (!isNonEmpty(data.companyDetails.companyType)) errors.companyType = 'Company type is required';
  return errors;
}

export interface TeamSizeErrors {
  size?: string;
}

export function teamSizeErrors(data: OnboardingFormData): TeamSizeErrors {
  return isNonEmpty(data.teamSize.size) ? {} : { size: 'Select a team size' };
}
