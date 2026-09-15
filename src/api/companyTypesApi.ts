import { delay } from './delay';

// GET /api/company-types - the one screen that loads its options from
// an API instead of being hardcoded.
export interface CompanyType {
  id: string;
  label: string;
}

const COMPANY_TYPES: CompanyType[] = [
  { id: 'llc', label: 'LLC' },
  { id: 'corporation', label: 'Corporation' },
  { id: 'partnership', label: 'Partnership' },
  { id: 'sole-proprietorship', label: 'Sole Proprietorship' },
  { id: 'nonprofit', label: 'Nonprofit' },
];

// fails on the first call of each page load so the loading -> error ->
// retry -> success path is always reachable, then behaves after that
let hasFailedOnce = false;

export async function fetchCompanyTypes(): Promise<CompanyType[]> {
  await delay(700);
  if (!hasFailedOnce) {
    hasFailedOnce = true;
    throw new Error('Could not load company types.');
  }
  return COMPANY_TYPES;
}
