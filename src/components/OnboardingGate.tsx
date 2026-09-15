import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useOnboardingIO, useOnboardingState } from '../workflow/useOnboarding';

// gates the app on the initial load of saved progress - shows a spinner,
// then either the app or a retryable error, never a blank/broken screen
export function OnboardingGate({ children }: { children: ReactNode }) {
  const { loadStatus, loadError } = useOnboardingState();
  const { retryLoad } = useOnboardingIO();

  if (loadStatus === 'loading' || loadStatus === 'idle') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress color="inherit" size={32} />
          <Typography color="text.secondary">Loading your progress…</Typography>
        </Stack>
      </Box>
    );
  }

  if (loadStatus === 'error') {
    return (
      <Box sx={{ py: 6 }}>
        <Alert
          severity="error"
          variant="outlined"
          sx={{ borderColor: 'black', color: 'black', alignItems: 'center' }}
          action={
            <Button variant="contained" color="primary" size="small" onClick={retryLoad}>
              Retry
            </Button>
          }
        >
          {loadError ?? 'Something went wrong loading your progress.'}
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
}
