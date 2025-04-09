import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ClockIcon } from "lucide-react";

export const ShiftDetailsCalendar = ({
  control,
}: {
  control: ReturnType<typeof useShiftDetailsControl>;
}) => {
  const shiftStart = dayjs(control.shiftFromParam!.startTime, "YYYY-MM-DD");
  const today = dayjs();
  const daysUntilShift = shiftStart.diff(today, "day");
  const daysAwayString =
    daysUntilShift === 0
      ? "Today"
      : daysUntilShift === 1
      ? `1 day away`
      : daysUntilShift === -1
      ? `1 day ago`
      : daysUntilShift > 0
      ? `${daysUntilShift} days away`
      : `${Math.abs(daysUntilShift)} days ago`;

  return (
    <>
      <h2 className="text-2xl font-semibold mb-2 flex justify-center">
        Shift Date
      </h2>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={dayjs(control.shiftFromParam!.startTime, "YYYY-MM-DD")}
          readOnly
        />
      </LocalizationProvider>
      <p className="py-4 flex justify-center items-center gap-2 font-semibold text-3xl border-t border-slate-300">
        <ClockIcon />
        {daysAwayString}
      </p>

      <p className="flex justify-center text-xl">
        {dayjs(control.shiftFromParam?.startTime).format("MM:ss")} -{" "}
        {dayjs(control.shiftFromParam?.endTime).format("MM:ss")}
      </p>
    </>
  );
};
