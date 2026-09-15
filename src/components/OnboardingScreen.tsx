import type { ComponentType } from 'react';
import type { StepId } from '../workflow/types';
import { useOnboardingState } from '../workflow/state/useOnboarding';
import { AppLayout } from './layout/AppLayout';
import { AccountTypeStep } from './steps/AccountTypeStep';
import { CompanyDetailsStep } from './steps/CompanyDetailsStep';
import { CompleteStep } from './steps/CompleteStep';
import { PersonalDetailsStep } from './steps/PersonalDetailsStep';
import { PersonalInformationStep } from './steps/PersonalInformationStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { ReviewStep } from './steps/ReviewStep';
import { TeamSizeStep } from './steps/TeamSizeStep';

const stepScreens: Record<StepId, ComponentType> = {
  personalInfo: PersonalInformationStep,
  accountType: AccountTypeStep,
  personalDetails: PersonalDetailsStep,
  companyDetails: CompanyDetailsStep,
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
