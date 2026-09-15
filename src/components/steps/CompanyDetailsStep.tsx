import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FIELD_LIMITS, companyDetailsErrors, fieldErrorProps, lengthSlotProps } from '../../workflow/fieldErrors';
import { useStepErrors } from '../../workflow/useStepErrors';
import { useStepField } from '../../workflow/useStepField';
import { useCompanyTypes } from './useCompanyTypes';

export function CompanyDetailsStep() {
  const [companyName, setCompanyName] = useStepField('companyDetails', 'companyName');
  const [companyType, setCompanyType] = useStepField('companyDetails', 'companyType');
  const { status, companyTypes, error, retry } = useCompanyTypes();
  const { errors, attemptedAdvance } = useStepErrors(companyDetailsErrors);

  return (
    <Stack spacing={3}>
      <TextField
        label="Company name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.companyName)}
        {...fieldErrorProps(attemptedAdvance, errors.companyName)}
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
          required
          fullWidth
          {...fieldErrorProps(attemptedAdvance, errors.companyType)}
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
