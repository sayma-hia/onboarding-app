import type { OnboardingAction } from './onboardingReducer';
import type { OnboardingFormData } from '../types';
import { useOnboardingDispatch, useOnboardingState } from './useOnboarding';

// binds a single field of a single step's data to the shared state,
// so screens don't have to hand-roll a dispatch call for every input
export function useStepField<
  Step extends keyof OnboardingFormData,
  Field extends keyof OnboardingFormData[Step],
>(step: Step, field: Field) {
  const { data } = useOnboardingState();
  const dispatch = useOnboardingDispatch();

  const value = data[step][field];
  const setValue = (next: OnboardingFormData[Step][Field]) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { step, field, value: next } } as OnboardingAction);
  };

  return [value, setValue] as const;
}
