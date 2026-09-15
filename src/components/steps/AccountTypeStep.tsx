import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { accountTypeErrors } from '../../workflow/fieldErrors';
import type { AccountType } from '../../workflow/types';
import { useStepErrors } from '../../workflow/state/useStepErrors';
import { useStepField } from '../../workflow/state/useStepField';

export function AccountTypeStep() {
  const [type, setType] = useStepField('accountType', 'type');
  const { errors, attemptedAdvance } = useStepErrors(accountTypeErrors);
  const showError = attemptedAdvance && !!errors.type;

  return (
    <FormControl error={showError}>
      <FormLabel id="account-type-label">Account type</FormLabel>
      <RadioGroup
        aria-labelledby="account-type-label"
        value={type}
        onChange={(e) => setType(e.target.value as AccountType)}
      >
        <FormControlLabel value="individual" control={<Radio />} label="Individual" />
        <FormControlLabel value="business" control={<Radio />} label="Business" />
      </RadioGroup>
      {showError && <FormHelperText>{errors.type}</FormHelperText>}
    </FormControl>
  );
}
