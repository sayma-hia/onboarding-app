import type { OnboardingFormData, StepId } from '../workflow/types';
import { delay } from './delay';

// GET /api/onboarding/:id and PUT /api/onboarding/:id, mocked with
// localStorage standing in for a database. No real backend for this
// exercise, but the shape matches what a real REST client would do.
export interface OnboardingRecord {
  data: OnboardingFormData;
  currentStep: StepId;
  history: StepId[];
}

const STORE_KEY = 'onboarding-api-store';
const NETWORK_DELAY = 500;
const FAILURE_RATE = 0.1;

function readStore(): Record<string, OnboardingRecord> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, OnboardingRecord>): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function maybeFail(message: string): void {
  if (Math.random() < FAILURE_RATE) {
    throw new Error(message);
  }
}

export async function getOnboarding(id: string): Promise<OnboardingRecord | null> {
  await delay(NETWORK_DELAY);
  maybeFail('Could not load your saved progress. Please try again.');
  const store = readStore();
  return store[id] ?? null;
}

export async function saveOnboarding(id: string, record: OnboardingRecord): Promise<void> {
  await delay(NETWORK_DELAY);
  maybeFail('Could not save your progress. Please try again.');
  const store = readStore();
  store[id] = record;
  writeStore(store);
}
