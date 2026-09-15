// GET /api/company-types - the one screen that loads its options from an
// API instead of being hardcoded. Intercepted by MSW; see mocks/handlers.ts
// for the simulated latency and the deliberate first-call failure.
export interface CompanyType {
  id: string;
  label: string;
}

// canonical list, also served by the mock handler and used here on the
// client to resolve a selected id back to its label on the review screen
export const COMPANY_TYPES: CompanyType[] = [
  { id: 'llc', label: 'LLC' },
  { id: 'corporation', label: 'Corporation' },
  { id: 'partnership', label: 'Partnership' },
  { id: 'sole-proprietorship', label: 'Sole Proprietorship' },
  { id: 'nonprofit', label: 'Nonprofit' },
];

export async function fetchCompanyTypes(): Promise<CompanyType[]> {
  const response = await fetch('/api/company-types');
  if (!response.ok) {
    throw new Error('Could not load company types.');
  }
  return response.json();
}
