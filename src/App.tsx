import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { OnboardingGate } from './components/OnboardingGate';
import { OnboardingScreen } from './components/OnboardingScreen';
import { OnboardingProvider } from './workflow/state/OnboardingContext';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" align="center" sx={{ mb: 4 }}>
          Onboarding
        </Typography>
        <OnboardingProvider>
          <OnboardingGate>
            <OnboardingScreen />
          </OnboardingGate>
        </OnboardingProvider>
      </Container>
    </Box>
  );
}

export default App;
