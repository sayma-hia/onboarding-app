import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { personalInfoErrors } from '../../workflow/fieldErrors';
import { useOnboardingState } from '../../workflow/useOnboarding';
import { useStepField } from '../../workflow/useStepField';

export function PersonalInformationStep() {
  const [firstName, setFirstName] = useStepField('personalInfo', 'firstName');
  const [lastName, setLastName] = useStepField('personalInfo', 'lastName');
  const [email, setEmail] = useStepField('personalInfo', 'email');
  const { data, attemptedAdvance } = useOnboardingState();
  const errors = personalInfoErrors(data);

  return (
    <Stack spacing={3}>
      <TextField
        label="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        error={attemptedAdvance && !!errors.firstName}
        helperText={attemptedAdvance ? errors.firstName : undefined}
        required
        fullWidth
      />
      <TextField
        label="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        error={attemptedAdvance && !!errors.lastName}
        helperText={attemptedAdvance ? errors.lastName : undefined}
        required
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={attemptedAdvance && !!errors.email}
        helperText={attemptedAdvance ? errors.email : undefined}
        required
        fullWidth
      />
    </Stack>
  );
}
