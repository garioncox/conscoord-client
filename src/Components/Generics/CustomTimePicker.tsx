import { CustomTimePickerControl } from "./control/CustomTimePickerControl";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const CustomTimePicker: React.FC<{
  label?: string;
  control: CustomTimePickerControl;
}> = ({ label, control }) => {
  return (
    <div className="relative pb-2 pt-8">
      <div>
        <TimePicker
          label={label}
          ampm={false}
          sx={
            control.error
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
              : {}
          }
          value={control.value}
          onChange={(newValue) => {
            control.setHasBeenTouched(true);
            control.setValue(newValue!);
          }}
          onClose={() => control.setHasBeenTouched(true)}
        />
      </div>
      {control.hasBeenTouched && (
        <p className="absolute text-sm text-red-500 left-3">{control.error}</p>
      )}
    </div>
  );
};

export default CustomTimePicker;
