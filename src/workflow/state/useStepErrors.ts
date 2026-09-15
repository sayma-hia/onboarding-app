import type { OnboardingFormData } from './types';
import { useOnboardingState } from './useOnboarding';

// every step screen needs the same two things to render its own
// validation - the current field errors and whether to show them yet.
// centralizing this means adding a new step never means re-deriving it.
export function useStepErrors<Errors extends object>(
  getErrors: (data: OnboardingFormData) => Errors,
) {
  const { data, attemptedAdvance } = useOnboardingState();
  return { errors: getErrors(data), attemptedAdvance };
}
