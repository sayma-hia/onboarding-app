import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { fieldErrorProps, teamSizeErrors } from '../../workflow/fieldErrors';
import { useStepErrors } from '../../workflow/state/useStepErrors';
import { useStepField } from '../../workflow/state/useStepField';

const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export function TeamSizeStep() {
  const [size, setSize] = useStepField('teamSize', 'size');
  const { errors, attemptedAdvance } = useStepErrors(teamSizeErrors);

  return (
    <TextField
      select
      label="Team size"
      value={size}
      onChange={(e) => setSize(e.target.value)}
      required
      fullWidth
      {...fieldErrorProps(attemptedAdvance, errors.size)}
    >
      {TEAM_SIZES.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
