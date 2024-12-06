import { TextField } from "@mui/material";
import { GTextInputController } from "./control/gTextInputController";

const GTextInput: React.FC<{
  label?: string;
  placeholder?: string;
  control: GTextInputController;
  minLength?: number;
  maxLength?: number;
  multiline?: boolean;
  lines?: number;
}> = ({
  label,
  placeholder,
  control,
  minLength,
  maxLength,
  multiline,
  lines,
}) => {
  return (
    <div className="relative pb-2 pt-8">
      <div>
        <TextField
          label={label}
          type="text"
          multiline={multiline}
          rows={lines ?? 0}
          placeholder={placeholder ?? ""}
          className="rounded shadow-inner p-2 text-black"
          value={control.value}
          onChange={(e) => {
            control.setValue(e.target.value);
            control.setHasBeenTouched(true);
          }}
          slotProps={{
            htmlInput: {
              minLength: minLength ?? 0,
              maxLength: maxLength ?? 10,
            },
          }}
          sx={{
            width: "100%",
            ...(control.error && control.hasBeenTouched
              ? {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "red",
                    },
                    "&:hover fieldset": {
                      borderColor: "blue",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "red",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "red",
                    },
                  },
                }
              : {}),
          }}
          onBlur={() => control.setHasBeenTouched(true)}
        />
      </div>
      {control.hasBeenTouched && (
        <p className="absolute text-sm text-red-500 left-3">{control.error}</p>
      )}
    </div>
  );
};

export default GTextInput;
