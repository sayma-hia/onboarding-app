import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FIELD_LIMITS, fieldErrorProps, lengthSlotProps, personalDetailsErrors } from '../../workflow/fieldErrors';
import { useStepErrors } from '../../workflow/state/useStepErrors';
import { useStepField } from '../../workflow/state/useStepField';

export function PersonalDetailsStep() {
  const [jobTitle, setJobTitle] = useStepField('personalDetails', 'jobTitle');
  const [phone, setPhone] = useStepField('personalDetails', 'phone');
  const { errors, attemptedAdvance } = useStepErrors(personalDetailsErrors);

  return (
    <Stack spacing={3}>
      <TextField
        label="Job title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        required
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.jobTitle)}
        {...fieldErrorProps(attemptedAdvance, errors.jobTitle)}
      />
      <TextField
        label="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.phone)}
        {...fieldErrorProps(attemptedAdvance, errors.phone)}
      />
    </Stack>
  );
}
