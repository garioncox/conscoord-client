import { CustomTimePickerControl } from "./control/CustomTimePickerControl";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const CustomTimePicker: React.FC<{
  label?: string;
  control: CustomTimePickerControl;
}> = ({ label, control }) => {
  return (
    <TimePicker
      label={label}
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
  );
};

export default CustomTimePicker;
