import { useReducer, type ReactNode } from 'react';
import { OnboardingDispatchContext, OnboardingStateContext } from './onboardingContexts';
import { initialOnboardingState, onboardingReducer } from './onboardingReducer';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialOnboardingState);

  return (
    <OnboardingStateContext.Provider value={state}>
      <OnboardingDispatchContext.Provider value={dispatch}>
        {children}
      </OnboardingDispatchContext.Provider>
    </OnboardingStateContext.Provider>
  );
}
