import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useOnboardingDispatch, useOnboardingState } from '../../workflow/useOnboarding';

// Next stays clickable even when the step is invalid - clicking it is what
// reveals the field errors, instead of leaving the user staring at a
// disabled button with no explanation
export function NavigationBar() {
  const { history } = useOnboardingState();
  const dispatch = useOnboardingDispatch();

  const canGoBack = history.length > 0;

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={() => dispatch({ type: 'GO_BACK' })} disabled={!canGoBack}>
        Back
      </Button>
      <Button variant="contained" onClick={() => dispatch({ type: 'GO_NEXT' })}>
        Next
      </Button>
    </Stack>
  );
}
