import {
  accountTypeErrors,
  companyDetailsErrors,
  hasNoErrors,
  officeDetailsErrors,
  personalDetailsErrors,
  personalInfoErrors,
  teamSizeErrors,
} from "./fieldErrors";
import type { OnboardingFormData, StepId } from "./types";

// central place that owns "what comes next" and "can we leave this step".
// screens themselves never decide where to navigate - they just read/write
// data and call goNext/goBack from the workflow context.
export interface StepDefinition {
  id: StepId;
  title: string;
  next: (data: OnboardingFormData) => StepId;
  isValid: (data: OnboardingFormData) => boolean;
}

export const steps: Record<StepId, StepDefinition> = {
  personalInfo: {
    id: "personalInfo",
    title: "Personal Information",
    next: () => "accountType",
    isValid: (data) => hasNoErrors(personalInfoErrors(data)),
  },
  accountType: {
    id: "accountType",
    title: "Account Type",
    next: (data) =>
      data.accountType.type === "business"
        ? "companyDetails"
        : "personalDetails",
    isValid: (data) => hasNoErrors(accountTypeErrors(data)),
  },
  personalDetails: {
    id: "personalDetails",
    title: "Personal Details",
    next: () => "preferences",
    isValid: (data) => hasNoErrors(personalDetailsErrors(data)),
  },
  companyDetails: {
    id: "companyDetails",
    title: "Company Details",
    next: () => "officeDetails",
    isValid: (data) => hasNoErrors(companyDetailsErrors(data)),
  },
  officeDetails: {
    id: "officeDetails",
    title: "Office Details",
    next: () => "teamSize",
    isValid: (data) => hasNoErrors(officeDetailsErrors(data)),
  },
  teamSize: {
    id: "teamSize",
    title: "Team Size",
    next: () => "preferences",
    isValid: (data) => hasNoErrors(teamSizeErrors(data)),
  },
  preferences: {
    id: "preferences",
    title: "Preferences",
    next: () => "review",
    isValid: () => true,
  },
  review: {
    id: "review",
    title: "Review",
    next: () => "complete",
    isValid: () => true,
  },
  complete: {
    id: "complete",
    title: "Complete",
    next: () => "complete",
    isValid: () => true,
  },
};

// walks the workflow from the start using the current answers, so the
// progress bar reflects the path this particular user is actually on
// (business users see a different length journey than individuals).
export function resolvePath(data: OnboardingFormData): StepId[] {
  const path: StepId[] = [];
  let current: StepId = "personalInfo";

  while (true) {
    path.push(current);
    if (current === "complete") break;
    current = steps[current].next(data);
  }

  return path;
}
