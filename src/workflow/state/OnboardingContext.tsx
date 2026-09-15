import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { getOnboarding, saveOnboarding } from '../../api/onboardingApi';
import {
  OnboardingDispatchContext,
  OnboardingIOContext,
  OnboardingStateContext,
} from './onboardingContexts';
import { initialOnboardingState, onboardingReducer } from './onboardingReducer';
import { getSessionId } from './session';

const AUTOSAVE_DELAY = 800;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialOnboardingState);
  const [sessionId] = useState(getSessionId);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const loadOnboarding = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const record = await getOnboarding(sessionId);
      dispatch({ type: 'LOAD_SUCCESS', payload: record });
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        error: err instanceof Error ? err.message : 'Failed to load your progress.',
      });
    }
  }, [sessionId]);

  useEffect(() => {
    loadOnboarding();
  }, [loadOnboarding]);

  // autosave, debounced so we're not writing on every keystroke
  useEffect(() => {
    if (state.loadStatus !== 'loaded') return;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      dispatch({ type: 'SAVE_START' });
      saveOnboarding(sessionId, {
        data: state.data,
        currentStep: state.currentStep,
        history: state.history,
      })
        .then(() => dispatch({ type: 'SAVE_SUCCESS' }))
        .catch((err) =>
          dispatch({
            type: 'SAVE_ERROR',
            error: err instanceof Error ? err.message : 'Failed to save your progress.',
          }),
        );
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(saveTimer.current);
  }, [state.data, state.currentStep, state.history, state.loadStatus, sessionId]);

  return (
    <OnboardingStateContext.Provider value={state}>
      <OnboardingDispatchContext.Provider value={dispatch}>
        <OnboardingIOContext.Provider value={{ retryLoad: loadOnboarding }}>
          {children}
        </OnboardingIOContext.Provider>
      </OnboardingDispatchContext.Provider>
    </OnboardingStateContext.Provider>
  );
}
