import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { OnboardingGate } from './components/OnboardingGate';
import { OnboardingProvider } from './workflow/OnboardingContext';
import { steps } from './workflow/steps';
import { useOnboardingDispatch, useOnboardingState } from './workflow/useOnboarding';

// placeholder body just to prove the load/save loop works end to end -
// the real screens land in the next branch
function OnboardingPlaceholder() {
  const state = useOnboardingState();
  const dispatch = useOnboardingDispatch();
  const step = steps[state.currentStep];

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{step.title}</Typography>
      <Typography color="text.secondary">
        {state.saveStatus === 'saving' && 'Saving…'}
        {state.saveStatus === 'saved' && 'All changes saved'}
        {state.saveStatus === 'error' && (state.saveError ?? 'Save failed')}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => dispatch({ type: 'GO_BACK' })}>
          Back
        </Button>
        <Button variant="contained" onClick={() => dispatch({ type: 'GO_NEXT' })}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" align="center" sx={{ mb: 4 }}>
          Onboarding
        </Typography>
        <OnboardingProvider>
          <OnboardingGate>
            <OnboardingPlaceholder />
          </OnboardingGate>
        </OnboardingProvider>
      </Container>
    </Box>
  );
}

export default App;
