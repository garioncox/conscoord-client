import { GSelectInputController } from "./control/gSelectInputController";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

const GSelectInput: React.FC<{
  label?: string;
  control: GSelectInputController;
}> = ({ label, control }) => {
  if (control.value) {
    control.setHasBeenTouched(true);
  }

  const handleChange = (e: SelectChangeEvent) => {
    control.setValue(e.target.value);
    control.setHasBeenTouched(true);
  };

  return (
    <>
      <label className="form-label d-flex flex-column flex-grow-1">
        {label}
        <Select
          value={control.value}
          onChange={handleChange}
          onBlur={() => control.setHasBeenTouched(true)}
        >
          <MenuItem value="" disabled />
          {control.possibleValues.map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </Select>
        <p className="invalid-feedback">{control.error}</p>
      </label>
    </>
  );
};

export default GSelectInput;
