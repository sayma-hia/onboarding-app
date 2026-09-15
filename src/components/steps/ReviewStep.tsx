import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { COMPANY_TYPES } from '../../api/companyTypesApi';
import type { StepId } from '../../workflow/types';
import { useOnboardingDispatch, useOnboardingState } from '../../workflow/state/useOnboarding';

interface ReviewField {
  label: string;
  value: string;
}

function ReviewCard({
  title,
  editStep,
  fields,
}: {
  title: string;
  editStep: StepId;
  fields: ReviewField[];
}) {
  const dispatch = useOnboardingDispatch();

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Button size="small" onClick={() => dispatch({ type: 'GO_TO', step: editStep })}>
          Edit
        </Button>
      </Stack>
      <Stack spacing={1}>
        {fields.map((field) => (
          <Stack
            key={field.label}
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between' }}
          >
            <Typography variant="body2" color="text.secondary">
              {field.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>
              {field.value || '—'}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function subscriptionLabel(subscribed: boolean): string {
  return subscribed ? 'Subscribed' : 'Not subscribed';
}

export function ReviewStep() {
  const { data } = useOnboardingState();
  const isBusiness = data.accountType.type === 'business';
  const companyTypeLabel =
    COMPANY_TYPES.find((option) => option.id === data.companyDetails.companyType)?.label ?? '';

  return (
    <Stack spacing={2.5}>
      <ReviewCard
        title="Personal information"
        editStep="personalInfo"
        fields={[
          {
            label: 'Full name',
            value: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim(),
          },
          { label: 'Email', value: data.personalInfo.email },
        ]}
      />

      <ReviewCard
        title="Account type"
        editStep="accountType"
        fields={[{ label: 'Selected', value: isBusiness ? 'Business' : 'Individual' }]}
      />

      {isBusiness ? (
        <>
          <ReviewCard
            title="Company details"
            editStep="companyDetails"
            fields={[
              { label: 'Company name', value: data.companyDetails.companyName },
              { label: 'Company type', value: companyTypeLabel },
            ]}
          />
          <ReviewCard
            title="Team size"
            editStep="teamSize"
            fields={[{ label: 'Employees', value: data.teamSize.size }]}
          />
        </>
      ) : (
        <ReviewCard
          title="Personal details"
          editStep="personalDetails"
          fields={[
            { label: 'Job title', value: data.personalDetails.jobTitle },
            { label: 'Phone', value: data.personalDetails.phone },
          ]}
        />
      )}

      <ReviewCard
        title="Preferences"
        editStep="preferences"
        fields={[
          { label: 'Newsletter', value: subscriptionLabel(data.preferences.newsletter) },
          { label: 'Product updates', value: subscriptionLabel(data.preferences.productUpdates) },
        ]}
      />
    </Stack>
  );
}
