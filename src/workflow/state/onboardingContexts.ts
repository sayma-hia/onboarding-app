import { createContext, type Dispatch } from "react";
import type { OnboardingAction, OnboardingState } from "./onboardingReducer";

// state and dispatch are split into two contexts so components that only
// dispatch actions (buttons) don't re-render on every keystroke
export const OnboardingStateContext = createContext<
  OnboardingState | undefined
>(undefined);
export const OnboardingDispatchContext = createContext<
  Dispatch<OnboardingAction> | undefined
>(undefined);
// small escape hatch for the imperative bits the reducer can't own,
// like retrying a failed initial load
export interface OnboardingIO {
  retryLoad: () => void;
}
export const OnboardingIOContext = createContext<OnboardingIO | undefined>(
  undefined
);
