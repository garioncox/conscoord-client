import { TextField } from "@mui/material";
import { GTextInputController } from "./gTextInputController";

const GTextInput: React.FC<{
  label?: string;
  placeholder?: string;
  control: GTextInputController;
  minLength?: number;
  maxLength?: number;
}> = ({ label, placeholder, control, minLength, maxLength }) => {
  return (
    <div className="relative pb-5 pt-8">
      <label className="absolute top-0 left-2">{label}</label>
      <div>
        <TextField
          type="text"
          placeholder={placeholder ?? ""}
          className="rounded shadow-inner p-2 text-black"
          value={control.value}
          onChange={(e) => {
            control.setValue(e.target.value);
            control.setHasBeenTouched(true);
          }}
          slotProps={{ htmlInput:{minLength: minLength ?? 0, maxLength: maxLength ?? 10} }}

          onBlur={() => control.setHasBeenTouched(true)}
          
        />
        {control.error && control.hasBeenTouched ? (
          <i className="bi bi-exclamation-circle absolute right-3 top-1/2 transform -translate-y-1/4 text-red-500" />
        ) : (
          ""
        )}
      </div>
      {control.hasBeenTouched && (
        <p className="absolute text-sm text-red-500 left-3">{control.error}</p>
      )}
    </div>
  );
};

export default GTextInput;
