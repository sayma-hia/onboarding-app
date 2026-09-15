import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { companyDetailsErrors } from '../../workflow/fieldErrors';
import { useOnboardingState } from '../../workflow/useOnboarding';
import { useStepField } from '../../workflow/useStepField';
import { useCompanyTypes } from './useCompanyTypes';

export function CompanyDetailsStep() {
  const [companyName, setCompanyName] = useStepField('companyDetails', 'companyName');
  const [companyType, setCompanyType] = useStepField('companyDetails', 'companyType');
  const { status, companyTypes, error, retry } = useCompanyTypes();
  const { data, attemptedAdvance } = useOnboardingState();
  const errors = companyDetailsErrors(data);

  return (
    <Stack spacing={3}>
      <TextField
        label="Company name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        error={attemptedAdvance && !!errors.companyName}
        helperText={attemptedAdvance ? errors.companyName : undefined}
        required
        fullWidth
      />

      {status === 'loading' && (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress size={20} color="inherit" />
          <Typography color="text.secondary">Loading company types…</Typography>
        </Stack>
      )}

      {status === 'error' && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ borderColor: 'black', color: 'black' }}
          action={
            <Button size="small" variant="contained" onClick={retry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {status === 'success' && (
        <TextField
          select
          label="Company type"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          error={attemptedAdvance && !!errors.companyType}
          helperText={attemptedAdvance ? errors.companyType : undefined}
          required
          fullWidth
        >
          {companyTypes.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  );
}
