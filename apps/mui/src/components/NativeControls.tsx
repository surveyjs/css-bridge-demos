"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

/**
 * Stock MUI form controls shown beside the SurveyJS form so the bridge's
 * fidelity is verifiable by eye: each control here is the native MUI rendering
 * the bridged SurveyJS field should be indistinguishable from. Pure chrome — no
 * SurveyJS involvement. Field set mirrors apps/bootstrap's NativeControls so the
 * two demos compare like-for-like.
 */
export function NativeControls() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Native MUI
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Stock Material UI controls — the bridged form should match these.
        </Typography>

        <Stack spacing={3}>
          <TextField label="First name" placeholder="Enter text…" variant="outlined" fullWidth />

          <FormControl fullWidth>
            <InputLabel id="native-select-label">Preferred contact method</InputLabel>
            <Select
              labelId="native-select-label"
              label="Preferred contact method"
              defaultValue=""
            >
              <MenuItem value="" disabled>
                Select an option…
              </MenuItem>
              <MenuItem value="phone">Phone</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="text">Text message</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Current medications"
            placeholder="Enter longer text…"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
          />

          <FormControl>
            <FormLabel id="native-radio-label">Sex assigned at birth</FormLabel>
            <RadioGroup
              row
              aria-labelledby="native-radio-label"
              name="native-radio"
              defaultValue="f"
            >
              <FormControlLabel value="f" control={<Radio />} label="Female" />
              <FormControlLabel value="m" control={<Radio />} label="Male" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Consent</FormLabel>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="I consent to treatment"
            />
          </FormControl>

          <TextField
            label="Required field (invalid state)"
            variant="outlined"
            fullWidth
            error
            defaultValue=""
            helperText="This field is required."
          />

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button variant="contained">Complete</Button>
            <Button variant="outlined">Check</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
