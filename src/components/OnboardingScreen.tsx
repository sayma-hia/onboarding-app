import type { ComponentType } from "react";
import { useOnboardingState } from "../workflow/state/useOnboarding";
import type { StepId } from "../workflow/types";
import { AppLayout } from "./layout/AppLayout";
import { AccountTypeStep } from "./steps/AccountTypeStep";
import { CompanyDetailsStep } from "./steps/CompanyDetailsStep";
import { CompleteStep } from "./steps/CompleteStep";
import { OfficeDetailsStep } from "./steps/OfficeDetailsStep";
import { PersonalDetailsStep } from "./steps/PersonalDetailsStep";
import { PersonalInformationStep } from "./steps/PersonalInformationStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { ReviewStep } from "./steps/ReviewStep";
import { TeamSizeStep } from "./steps/TeamSizeStep";

const stepScreens: Record<StepId, ComponentType> = {
  personalInfo: PersonalInformationStep,
  accountType: AccountTypeStep,
  personalDetails: PersonalDetailsStep,
  companyDetails: CompanyDetailsStep,
  officeDetails: OfficeDetailsStep,
  teamSize: TeamSizeStep,
  preferences: PreferencesStep,
  review: ReviewStep,
  complete: CompleteStep,
};

export function OnboardingScreen() {
  const { currentStep } = useOnboardingState();
  const StepComponent = stepScreens[currentStep];

  return (
    <AppLayout>
      <StepComponent />
    </AppLayout>
  );
}
