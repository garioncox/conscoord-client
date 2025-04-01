import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

export const ShiftDetailsCalendar = ({ id }: { id: number }) => {
  const control = useShiftDetailsControl(id);
        {/* <p>{control.shiftFromParam.startTime}</p>
        <p>{control.shiftFromParam.endTime}</p> */}
  return (
    <>
      <div className="border p-4 rounded-lg shadow w-1/3 ">
        <h2 className="text-lg font-semibold mb-2">Shift Date</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dayjs(control.shiftFromParam!.startTime, "YYYY-MM-DD")}
            readOnly
          />
        </LocalizationProvider>
      </div>
    </>
  );
};
