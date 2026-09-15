import Typography from '@mui/material/Typography';
import type { ComponentType } from 'react';
import type { StepId } from '../workflow/types';
import { useOnboardingState } from '../workflow/useOnboarding';
import { AppLayout } from './layout/AppLayout';
import { AccountTypeStep } from './steps/AccountTypeStep';
import { CompanyDetailsStep } from './steps/CompanyDetailsStep';
import { PersonalDetailsStep } from './steps/PersonalDetailsStep';
import { PersonalInformationStep } from './steps/PersonalInformationStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { TeamSizeStep } from './steps/TeamSizeStep';

// review and complete get their own screens in a follow-up branch
function ComingSoon({ label }: { label: string }) {
  return <Typography color="text.secondary">{label} screen coming soon.</Typography>;
}

const stepScreens: Record<StepId, ComponentType> = {
  personalInfo: PersonalInformationStep,
  accountType: AccountTypeStep,
  personalDetails: PersonalDetailsStep,
  companyDetails: CompanyDetailsStep,
  teamSize: TeamSizeStep,
  preferences: PreferencesStep,
  review: () => <ComingSoon label="Review" />,
  complete: () => <ComingSoon label="Complete" />,
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
