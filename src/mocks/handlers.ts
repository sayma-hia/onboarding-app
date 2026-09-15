import { delay, http, HttpResponse } from 'msw';
import { COMPANY_TYPES } from '../api/companyTypesApi';
import type { OnboardingRecord } from '../api/onboardingApi';

// stands in for a database - localStorage so a record survives a refresh
const STORE_KEY = 'onboarding-api-store';
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

// fails on the first call of every page load so loading -> error -> retry
// -> success is always reachable during a demo, not just possible by luck
let companyTypesHasFailedOnce = false;

export const handlers = [
  http.get('/api/onboarding/:id', async ({ params }) => {
    await delay(500);
    if (Math.random() < FAILURE_RATE) {
      return HttpResponse.json(
        { message: 'Could not load your saved progress. Please try again.' },
        { status: 500 },
      );
    }
    const store = readStore();
    const record = store[params.id as string] ?? null;
    return HttpResponse.json(record);
  }),

  http.put('/api/onboarding/:id', async ({ params, request }) => {
    await delay(500);
    if (Math.random() < FAILURE_RATE) {
      return HttpResponse.json(
        { message: 'Could not save your progress. Please try again.' },
        { status: 500 },
      );
    }
    const record = (await request.json()) as OnboardingRecord;
    const store = readStore();
    store[params.id as string] = record;
    writeStore(store);
    return HttpResponse.json({ ok: true });
  }),

  http.get('/api/company-types', async () => {
    await delay(700);
    if (!companyTypesHasFailedOnce) {
      companyTypesHasFailedOnce = true;
      return HttpResponse.json({ message: 'Could not load company types.' }, { status: 500 });
    }
    return HttpResponse.json(COMPANY_TYPES);
  }),
];
