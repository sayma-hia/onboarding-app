import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { teamSizeErrors } from '../../workflow/fieldErrors';
import { useOnboardingState } from '../../workflow/useOnboarding';
import { useStepField } from '../../workflow/useStepField';

const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export function TeamSizeStep() {
  const [size, setSize] = useStepField('teamSize', 'size');
  const { data, attemptedAdvance } = useOnboardingState();
  const errors = teamSizeErrors(data);

  return (
    <TextField
      select
      label="Team size"
      value={size}
      onChange={(e) => setSize(e.target.value)}
      error={attemptedAdvance && !!errors.size}
      helperText={attemptedAdvance ? errors.size : undefined}
      required
      fullWidth
    >
      {TEAM_SIZES.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
