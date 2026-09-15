import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FIELD_LIMITS, fieldErrorProps, lengthSlotProps, personalInfoErrors } from '../../workflow/fieldErrors';
import { useStepErrors } from '../../workflow/useStepErrors';
import { useStepField } from '../../workflow/useStepField';

export function PersonalInformationStep() {
  const [firstName, setFirstName] = useStepField('personalInfo', 'firstName');
  const [lastName, setLastName] = useStepField('personalInfo', 'lastName');
  const [email, setEmail] = useStepField('personalInfo', 'email');
  const { errors, attemptedAdvance } = useStepErrors(personalInfoErrors);

  return (
    <Stack spacing={3}>
      <TextField
        label="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.firstName)}
        {...fieldErrorProps(attemptedAdvance, errors.firstName)}
      />
      <TextField
        label="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.lastName)}
        {...fieldErrorProps(attemptedAdvance, errors.lastName)}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.email)}
        {...fieldErrorProps(attemptedAdvance, errors.email)}
      />
    </Stack>
  );
}
