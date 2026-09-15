import { steps } from '../steps';
import { initialFormData } from '../types';
import type { OnboardingFormData, StepId } from '../types';

export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface OnboardingState {
  currentStep: StepId;
  history: StepId[];
  data: OnboardingFormData;
  // true once the user has tried to leave the current step while it was
  // invalid - screens use this to decide when to start showing field errors
  attemptedAdvance: boolean;
  loadStatus: LoadStatus;
  loadError: string | null;
  saveStatus: SaveStatus;
  saveError: string | null;
}

export const initialOnboardingState: OnboardingState = {
  currentStep: 'personalInfo',
  history: [],
  data: initialFormData,
  attemptedAdvance: false,
  loadStatus: 'idle',
  loadError: null,
  saveStatus: 'idle',
  saveError: null,
};

// generates a properly typed update action per step, so `field`/`value`
// can't be mismatched with the wrong step's shape at the call site
type UpdateFieldAction = {
  [K in keyof OnboardingFormData]: {
    type: 'UPDATE_FIELD';
    payload: {
      step: K;
      field: keyof OnboardingFormData[K];
      value: OnboardingFormData[K][keyof OnboardingFormData[K]];
    };
  };
}[keyof OnboardingFormData];

export interface HydratedSnapshot {
  data: OnboardingFormData;
  currentStep: StepId;
  history: StepId[];
}

export type OnboardingAction =
  | UpdateFieldAction
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: HydratedSnapshot | null }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'GO_NEXT' }
  | { type: 'GO_BACK' }
  | { type: 'GO_TO'; step: StepId }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'RESET' };

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const { step, field, value } = action.payload;
      let data: OnboardingFormData = {
        ...state.data,
        [step]: { ...state.data[step], [field]: value },
      };

      // switching account type invalidates whichever branch the user
      // is no longer on - drop that data so a stale answer never shows
      // up on the review screen after backing up and changing course
      if (step === 'accountType' && field === 'type') {
        if (value === 'individual') {
          data = {
            ...data,
            companyDetails: initialFormData.companyDetails,
            teamSize: initialFormData.teamSize,
          };
        } else if (value === 'business') {
          data = { ...data, personalDetails: initialFormData.personalDetails };
        }
      }

      return { ...state, data };
    }

    case 'GO_NEXT': {
      const current = steps[state.currentStep];
      if (!current.isValid(state.data)) return { ...state, attemptedAdvance: true };
      const next = current.next(state.data);
      return {
        ...state,
        currentStep: next,
        history: [...state.history, state.currentStep],
        attemptedAdvance: false,
      };
    }

    case 'GO_BACK': {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      return {
        ...state,
        currentStep: previous,
        history: state.history.slice(0, -1),
        attemptedAdvance: false,
      };
    }

    case 'GO_TO':
      return {
        ...state,
        currentStep: action.step,
        history: [...state.history, state.currentStep],
        attemptedAdvance: false,
      };

    case 'LOAD_START':
      return { ...state, loadStatus: 'loading', loadError: null };

    case 'LOAD_SUCCESS':
      if (!action.payload) return { ...state, loadStatus: 'loaded' };
      return {
        ...state,
        loadStatus: 'loaded',
        data: action.payload.data,
        currentStep: action.payload.currentStep,
        history: action.payload.history,
      };

    case 'LOAD_ERROR':
      return { ...state, loadStatus: 'error', loadError: action.error };

    case 'SAVE_START':
      return { ...state, saveStatus: 'saving', saveError: null };

    case 'SAVE_SUCCESS':
      return { ...state, saveStatus: 'saved' };

    case 'SAVE_ERROR':
      return { ...state, saveStatus: 'error', saveError: action.error };

    case 'RESET':
      return { ...initialOnboardingState, loadStatus: 'loaded' };

    default:
      return state;
  }
}
