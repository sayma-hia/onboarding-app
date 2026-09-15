import { describe, expect, it } from 'vitest';
import {
  initialOnboardingState,
  onboardingReducer,
  type HydratedSnapshot,
  type OnboardingState,
} from './onboardingReducer';
import { initialFormData } from '../types';

const validPersonalInfo = { firstName: 'Sayma', lastName: 'Hia', email: 'sayma@example.com' };

function state(overrides: Partial<OnboardingState>): OnboardingState {
  return { ...initialOnboardingState, ...overrides };
}

describe('UPDATE_FIELD', () => {
  it('writes the field without touching the rest of that step', () => {
    const next = onboardingReducer(
      initialOnboardingState,
      { type: 'UPDATE_FIELD', payload: { step: 'personalInfo', field: 'firstName', value: 'Sayma' } },
    );
    expect(next.data.personalInfo).toEqual({ firstName: 'Sayma', lastName: '', email: '' });
  });

  it('clears companyDetails and teamSize when switching to individual', () => {
    const withBusinessData = state({
      data: {
        ...initialFormData,
        accountType: { type: 'business' },
        companyDetails: { companyName: 'Acme Corp', companyType: 'llc' },
        teamSize: { size: '11-50' },
      },
    });

    const next = onboardingReducer(withBusinessData, {
      type: 'UPDATE_FIELD',
      payload: { step: 'accountType', field: 'type', value: 'individual' },
    });

    expect(next.data.accountType.type).toBe('individual');
    expect(next.data.companyDetails).toEqual(initialFormData.companyDetails);
    expect(next.data.teamSize).toEqual(initialFormData.teamSize);
  });

  it('clears personalDetails when switching to business', () => {
    const withIndividualData = state({
      data: {
        ...initialFormData,
        accountType: { type: 'individual' },
        personalDetails: { jobTitle: 'Engineer', phone: '555-1234' },
      },
    });

    const next = onboardingReducer(withIndividualData, {
      type: 'UPDATE_FIELD',
      payload: { step: 'accountType', field: 'type', value: 'business' },
    });

    expect(next.data.accountType.type).toBe('business');
    expect(next.data.personalDetails).toEqual(initialFormData.personalDetails);
  });

  it('does not disturb other steps data when switching account type', () => {
    const withData = state({
      data: { ...initialFormData, personalInfo: validPersonalInfo, accountType: { type: 'business' } },
    });

    const next = onboardingReducer(withData, {
      type: 'UPDATE_FIELD',
      payload: { step: 'accountType', field: 'type', value: 'individual' },
    });

    expect(next.data.personalInfo).toEqual(validPersonalInfo);
  });
});

describe('GO_NEXT', () => {
  it('does not advance when the current step is invalid, and flags attemptedAdvance', () => {
    const next = onboardingReducer(initialOnboardingState, { type: 'GO_NEXT' });
    expect(next.currentStep).toBe('personalInfo');
    expect(next.attemptedAdvance).toBe(true);
    expect(next.history).toEqual([]);
  });

  it('advances and records history once the step is valid', () => {
    const withValidData = state({ data: { ...initialFormData, personalInfo: validPersonalInfo } });
    const next = onboardingReducer(withValidData, { type: 'GO_NEXT' });

    expect(next.currentStep).toBe('accountType');
    expect(next.history).toEqual(['personalInfo']);
    expect(next.attemptedAdvance).toBe(false);
  });

  it('routes business accounts to companyDetails and individuals to personalDetails', () => {
    const businessState = state({
      currentStep: 'accountType',
      history: ['personalInfo'],
      data: { ...initialFormData, accountType: { type: 'business' } },
    });
    expect(onboardingReducer(businessState, { type: 'GO_NEXT' }).currentStep).toBe('companyDetails');

    const individualState = state({
      currentStep: 'accountType',
      history: ['personalInfo'],
      data: { ...initialFormData, accountType: { type: 'individual' } },
    });
    expect(onboardingReducer(individualState, { type: 'GO_NEXT' }).currentStep).toBe(
      'personalDetails',
    );
  });

  it('clears a previously set attemptedAdvance flag once the step becomes valid', () => {
    const invalidAttempted = state({ attemptedAdvance: true });
    const fixed = state({
      attemptedAdvance: true,
      data: { ...initialFormData, personalInfo: validPersonalInfo },
    });

    expect(onboardingReducer(invalidAttempted, { type: 'GO_NEXT' }).attemptedAdvance).toBe(true);
    expect(onboardingReducer(fixed, { type: 'GO_NEXT' }).attemptedAdvance).toBe(false);
  });
});

describe('GO_BACK', () => {
  it('does nothing when there is no history', () => {
    const next = onboardingReducer(initialOnboardingState, { type: 'GO_BACK' });
    expect(next).toBe(initialOnboardingState);
  });

  it('pops the last step off history and returns to it', () => {
    const midFlow = state({ currentStep: 'personalDetails', history: ['personalInfo', 'accountType'] });
    const next = onboardingReducer(midFlow, { type: 'GO_BACK' });

    expect(next.currentStep).toBe('accountType');
    expect(next.history).toEqual(['personalInfo']);
  });

  it('resets attemptedAdvance', () => {
    const midFlow = state({
      currentStep: 'personalDetails',
      history: ['personalInfo', 'accountType'],
      attemptedAdvance: true,
    });
    expect(onboardingReducer(midFlow, { type: 'GO_BACK' }).attemptedAdvance).toBe(false);
  });
});

describe('GO_TO', () => {
  it('jumps directly to the given step and pushes the current step onto history', () => {
    const onReview = state({
      currentStep: 'review',
      history: ['personalInfo', 'accountType', 'personalDetails', 'preferences'],
    });
    const next = onboardingReducer(onReview, { type: 'GO_TO', step: 'personalDetails' });

    expect(next.currentStep).toBe('personalDetails');
    expect(next.history).toEqual([
      'personalInfo',
      'accountType',
      'personalDetails',
      'preferences',
      'review',
    ]);
  });

  it('going back afterward returns to where GO_TO was called from', () => {
    const onReview = state({
      currentStep: 'review',
      history: ['personalInfo', 'accountType', 'personalDetails', 'preferences'],
    });
    const editing = onboardingReducer(onReview, { type: 'GO_TO', step: 'personalDetails' });
    const backToReview = onboardingReducer(editing, { type: 'GO_BACK' });

    expect(backToReview.currentStep).toBe('review');
  });
});

describe('load lifecycle', () => {
  it('LOAD_START enters the loading state and clears any prior error', () => {
    const next = onboardingReducer(state({ loadError: 'stale error' }), { type: 'LOAD_START' });
    expect(next.loadStatus).toBe('loading');
    expect(next.loadError).toBeNull();
  });

  it('LOAD_SUCCESS with no saved record just marks the app loaded', () => {
    const next = onboardingReducer(state({ loadStatus: 'loading' }), {
      type: 'LOAD_SUCCESS',
      payload: null,
    });
    expect(next.loadStatus).toBe('loaded');
    expect(next.currentStep).toBe('personalInfo');
  });

  it('LOAD_SUCCESS with a saved record hydrates data, step, and history', () => {
    const payload: HydratedSnapshot = {
      data: { ...initialFormData, personalInfo: validPersonalInfo },
      currentStep: 'preferences',
      history: ['personalInfo', 'accountType', 'personalDetails'],
    };
    const next = onboardingReducer(state({ loadStatus: 'loading' }), {
      type: 'LOAD_SUCCESS',
      payload,
    });

    expect(next.loadStatus).toBe('loaded');
    expect(next.currentStep).toBe('preferences');
    expect(next.data.personalInfo).toEqual(validPersonalInfo);
    expect(next.history).toEqual(payload.history);
  });

  it('LOAD_ERROR records the error message', () => {
    const next = onboardingReducer(state({ loadStatus: 'loading' }), {
      type: 'LOAD_ERROR',
      error: 'Could not load your saved progress. Please try again.',
    });
    expect(next.loadStatus).toBe('error');
    expect(next.loadError).toBe('Could not load your saved progress. Please try again.');
  });
});

describe('save lifecycle', () => {
  it('moves through saving -> saved', () => {
    const saving = onboardingReducer(initialOnboardingState, { type: 'SAVE_START' });
    expect(saving.saveStatus).toBe('saving');

    const saved = onboardingReducer(saving, { type: 'SAVE_SUCCESS' });
    expect(saved.saveStatus).toBe('saved');
  });

  it('SAVE_ERROR records the error message', () => {
    const next = onboardingReducer(initialOnboardingState, {
      type: 'SAVE_ERROR',
      error: 'Could not save your progress. Please try again.',
    });
    expect(next.saveStatus).toBe('error');
    expect(next.saveError).toBe('Could not save your progress. Please try again.');
  });
});

describe('RESET', () => {
  it('clears data, step, and history back to the start, but stays loaded', () => {
    const midFlow = state({
      currentStep: 'complete',
      history: ['personalInfo', 'accountType', 'personalDetails', 'preferences', 'review'],
      data: { ...initialFormData, personalInfo: validPersonalInfo },
      loadStatus: 'loaded',
    });

    const next = onboardingReducer(midFlow, { type: 'RESET' });

    expect(next.currentStep).toBe('personalInfo');
    expect(next.history).toEqual([]);
    expect(next.data).toEqual(initialFormData);
    expect(next.loadStatus).toBe('loaded');
  });
});
