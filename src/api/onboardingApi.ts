import type { OnboardingFormData, StepId } from '../workflow/types';

// GET /api/onboarding/:id and PUT /api/onboarding/:id - intercepted in the
// browser by MSW (see src/mocks/handlers.ts), which is where the latency,
// random failures, and the localStorage-backed "database" actually live.
// This module only knows it's talking to a REST API.
export interface OnboardingRecord {
  data: OnboardingFormData;
  currentStep: StepId;
  history: StepId[];
}

export async function getOnboarding(id: string): Promise<OnboardingRecord | null> {
  const response = await fetch(`/api/onboarding/${id}`);
  if (!response.ok) {
    throw new Error('Could not load your saved progress. Please try again.');
  }
  return response.json();
}

export async function saveOnboarding(id: string, record: OnboardingRecord): Promise<void> {
  const response = await fetch(`/api/onboarding/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!response.ok) {
    throw new Error('Could not save your progress. Please try again.');
  }
}
