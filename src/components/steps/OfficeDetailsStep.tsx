import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  FIELD_LIMITS,
  fieldErrorProps,
  lengthSlotProps,
  officeDetailsErrors,
} from "../../workflow/fieldErrors";
import { useStepErrors } from "../../workflow/state/useStepErrors";
import { useStepField } from "../../workflow/state/useStepField";

export function OfficeDetailsStep() {
  const [officeName, setOfficeName] = useStepField(
    "officeDetails",
    "officeName"
  );
  const [officeAddress, setOfficeAddress] = useStepField(
    "officeDetails",
    "officeAddress"
  );
  const { errors, attemptedAdvance } = useStepErrors(officeDetailsErrors);
  return (
    <Stack spacing={3}>
      <TextField
        label="Office name"
        value={officeName}
        onChange={(e) => setOfficeName(e.target.value)}
        required
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.officeName)}
        {...fieldErrorProps(attemptedAdvance, errors.officeName)}
      />
      <TextField
        label="Office address"
        value={officeAddress}
        onChange={(e) => setOfficeAddress(e.target.value)}
        required
        fullWidth
        {...lengthSlotProps(FIELD_LIMITS.officeAddress)}
        {...fieldErrorProps(attemptedAdvance, errors.officeAddress)}
      />
    </Stack>
  );
}
