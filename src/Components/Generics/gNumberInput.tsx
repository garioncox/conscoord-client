import { TextField } from "@mui/material";
import { GNumberInputController } from "./control/gNumberInputController";

const GNumberInput: React.FC<{
  label?: string;
  control: GNumberInputController;
  minimum?: number;
  maximum?: number;
}> = ({ label, control, minimum, maximum }) => {
  return (
    <div className="relative pb-2 pt-8 grow">
      <div className="mx-3">
        <TextField
          label={label}
          value={control.value}
          type="number"
          className="rounded shadow-inner p-2 text-black"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              min: minimum ?? 0,
              max: maximum ?? 10,
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
          onChange={(e) => {
            control.setValue(Number(e.target.value));
            control.setHasBeenTouched(true);
          }}
          onBlur={() => control.setHasBeenTouched(true)}
        />
        {/* <TextField
          type="number"
          className="rounded text-black shadow-inner p-2"
          slotProps={{ htmlInput: { min: minimum ?? 0, max: maximum ?? 10 } }}
          value={control.value}
        /> */}
      </div>
      {control.hasBeenTouched && (
        <p className="absolute text-sm text-red-500 left-3">{control.error}</p>
      )}
    </div>
  );
};

export default GNumberInput;
