import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useOnboardingDispatch, useOnboardingState } from '../../workflow/useOnboarding';

export function CompleteStep() {
  const { data } = useOnboardingState();
  const dispatch = useOnboardingDispatch();

  return (
    <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
      <Typography color="text.secondary">
        Welcome aboard{data.personalInfo.firstName ? `, ${data.personalInfo.firstName}` : ''}.
        Your account is set up and everything you entered has been saved.
      </Typography>
      <Button variant="outlined" onClick={() => dispatch({ type: 'RESET' })}>
        Start over
      </Button>
    </Stack>
  );
}
