import { useContext, type Dispatch } from 'react';
import { OnboardingDispatchContext, OnboardingStateContext } from './onboardingContexts';
import type { OnboardingAction, OnboardingState } from './onboardingReducer';

export function useOnboardingState(): OnboardingState {
  const context = useContext(OnboardingStateContext);
  if (!context) {
    throw new Error('useOnboardingState must be used within an OnboardingProvider');
  }
  return context;
}

export function useOnboardingDispatch(): Dispatch<OnboardingAction> {
  const context = useContext(OnboardingDispatchContext);
  if (!context) {
    throw new Error('useOnboardingDispatch must be used within an OnboardingProvider');
  }
  return context;
}
