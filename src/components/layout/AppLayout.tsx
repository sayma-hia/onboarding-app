import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { resolvePath, steps } from '../../workflow/steps';
import { useOnboardingState } from '../../workflow/useOnboarding';
import { NavigationBar } from './NavigationBar';
import { SaveStatusText } from './SaveStatusText';

// the progress bar walks the workflow with the user's own answers, so a
// business account sees a different step count than an individual one
export function AppLayout({ children }: { children: ReactNode }) {
  const { currentStep, data } = useOnboardingState();
  const path = resolvePath(data);
  const stepIndex = path.indexOf(currentStep);
  const totalSteps = path.length - 1; // exclude the terminal "complete" step
  const progress = totalSteps > 0 ? (stepIndex / totalSteps) * 100 : 0;
  const isComplete = currentStep === 'complete';

  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={3}>
        {!isComplete && (
          <Box>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Step {stepIndex + 1} of {totalSteps}
            </Typography>
          </Box>
        )}

        <Typography variant="h5" component="h2">
          {steps[currentStep].title}
        </Typography>

        {children}

        {!isComplete && (
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <SaveStatusText />
            <NavigationBar />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
