import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { useStepField } from '../../workflow/useStepField';

export function PreferencesStep() {
  const [newsletter, setNewsletter] = useStepField('preferences', 'newsletter');
  const [productUpdates, setProductUpdates] = useStepField('preferences', 'productUpdates');

  return (
    <Stack spacing={1}>
      <FormControlLabel
        control={<Checkbox checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />}
        label="Send me the newsletter"
      />
      <FormControlLabel
        control={
          <Checkbox checked={productUpdates} onChange={(e) => setProductUpdates(e.target.checked)} />
        }
        label="Send me product updates"
      />
    </Stack>
  );
}
