import { useCallback, useEffect, useState } from 'react';
import { fetchCompanyTypes, type CompanyType } from '../../api/companyTypesApi';

type Status = 'loading' | 'success' | 'error';

export function useCompanyTypes() {
  const [status, setStatus] = useState<Status>('loading');
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runFetch = useCallback(() => {
    fetchCompanyTypes()
      .then((types) => {
        setCompanyTypes(types);
        setStatus('success');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load company types.');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  const retry = useCallback(() => {
    setStatus('loading');
    setError(null);
    runFetch();
  }, [runFetch]);

  return { status, companyTypes, error, retry };
}
