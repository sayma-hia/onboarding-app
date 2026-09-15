import Typography from '@mui/material/Typography';
import { useOnboardingState } from '../../workflow/useOnboarding';

export function SaveStatusText() {
  const { saveStatus, saveError } = useOnboardingState();

  if (saveStatus === 'saving') {
    return <Typography variant="caption" color="text.secondary">Saving…</Typography>;
  }
  if (saveStatus === 'saved') {
    return <Typography variant="caption" color="text.secondary">All changes saved</Typography>;
  }
  if (saveStatus === 'error') {
    return (
      <Typography variant="caption" color="error">
        {saveError ?? 'Save failed'}
      </Typography>
    );
  }
  return null;
}
