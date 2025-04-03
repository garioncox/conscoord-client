import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

export const ShiftDetailsCalendar =  ({ control }: { control: ReturnType<typeof useShiftDetailsControl> }) => {
  const shiftStart = dayjs(control.shiftFromParam!.startTime, "YYYY-MM-DD");
  const today = dayjs();
  const daysUntilShift = shiftStart.diff(today, 'day');
  const daysAwayString = daysUntilShift === 0 
  ? "Shift is today" 
  : daysUntilShift === 1 
    ? `Shift is 1 day away` 
    : daysUntilShift === -1 
      ? `Shift was 1 day ago` 
      : daysUntilShift > 0 
        ? `Shift is ${daysUntilShift} days away` 
        : `Shift was ${Math.abs(daysUntilShift)} days ago`;

  return (
    <>
        <h2 className="text-2xl font-semibold mb-2 flex justify-center">Shift Date</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dayjs(control.shiftFromParam!.startTime, "YYYY-MM-DD")}
            readOnly
          />
        </LocalizationProvider>
        <p className="pb-4 flex justify-center font-semibold text-3xl">{daysAwayString}</p>
        <p className="flex justify-center text-xl">{control.shiftFromParam?.startTime.split('T')[1]} - {control.shiftFromParam?.endTime.split('T')[1]}</p>
    </>
  );
};
