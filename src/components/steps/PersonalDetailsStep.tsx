import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { personalDetailsErrors } from '../../workflow/fieldErrors';
import { useOnboardingState } from '../../workflow/useOnboarding';
import { useStepField } from '../../workflow/useStepField';

export function PersonalDetailsStep() {
  const [jobTitle, setJobTitle] = useStepField('personalDetails', 'jobTitle');
  const [phone, setPhone] = useStepField('personalDetails', 'phone');
  const { data, attemptedAdvance } = useOnboardingState();
  const errors = personalDetailsErrors(data);

  return (
    <Stack spacing={3}>
      <TextField
        label="Job title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        error={attemptedAdvance && !!errors.jobTitle}
        helperText={attemptedAdvance ? errors.jobTitle : undefined}
        required
        fullWidth
      />
      <TextField
        label="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
      />
    </Stack>
  );
}
