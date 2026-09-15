// step ids - add a new id here when a new screen is introduced
export type StepId =
  | 'personalInfo'
  | 'accountType'
  | 'personalDetails'
  | 'companyDetails'
  | 'teamSize'
  | 'preferences'
  | 'review'
  | 'complete';

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
}

export type AccountType = 'individual' | 'business' | '';

export interface AccountTypeData {
  type: AccountType;
}

export interface PersonalDetailsData {
  jobTitle: string;
  phone: string;
}

export interface CompanyDetailsData {
  companyName: string;
  companyType: string;
}

export interface TeamSizeData {
  size: string;
}

export interface PreferencesData {
  newsletter: boolean;
  productUpdates: boolean;
}

export interface OnboardingFormData {
  personalInfo: PersonalInfoData;
  accountType: AccountTypeData;
  personalDetails: PersonalDetailsData;
  companyDetails: CompanyDetailsData;
  teamSize: TeamSizeData;
  preferences: PreferencesData;
}

export const initialFormData: OnboardingFormData = {
  personalInfo: { firstName: '', lastName: '', email: '' },
  accountType: { type: '' },
  personalDetails: { jobTitle: '', phone: '' },
  companyDetails: { companyName: '', companyType: '' },
  teamSize: { size: '' },
  preferences: { newsletter: false, productUpdates: false },
};
