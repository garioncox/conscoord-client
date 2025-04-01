import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Checkbox } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";

export const LogTime = ({ id }: { id: number }) => {
  const control = useShiftDetailsControl(id);

  return (
    <>
      <div
        className={`justify-center p-4 border rounded-lg shadow  h-1/2${
          !control.currentEmpShift ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="font-semibold text-xl pb-5 text-center lg:text-left">
          Log Time
        </div>
        <div className="flex flex-col items-center space-y-5 lg:flex-row lg:space-y-0 lg:space-x-3">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              value={control.loggedStartTime}
              onChange={(newValue) => control.setLoggedStartTime(newValue)}
              disabled={
                control.isFormDisabled ||
                control.currentEmpShift?.reportedCanceled ||
                control.currentEmpShift?.didNotWork
              }
            />
            <TimePicker
              label="End Time"
              value={control.loggedEndTime}
              onChange={(newValue) => control.setLoggedEndTime(newValue)}
              disabled={
                control.isFormDisabled ||
                control.currentEmpShift?.reportedCanceled ||
                control.currentEmpShift?.didNotWork
              }
            />
          </LocalizationProvider>

          {/* Did not work + Canceled checkboxes */}
          <div>
            <div
              className={`flex flex-row items-center ${
                control.confirmedNotWorked || control.isFormDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                // if (!control.confirmedNotWorked && !control.isFormDisabled) {
                //   control.toggleShiftNotWorkedModal();
                // }
                console.log(control.isNotWorkedModalOpen )
                control.setNotWorkedModalOpen(true)
                control.setConfirmedNotWorked(false)
              }}
            >
              <Checkbox
                className={`${
                  control.confirmedNotWorked || control.isFormDisabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                checked={control.confirmedNotWorked}
                disabled={control.confirmedNotWorked || control.isFormDisabled}
              />
              <div>I did not work this shift</div>
            </div>

            <div
              className={`flex flex-row items-center ${
                control.confirmedNotWorked ? "inline" : "hidden"
              } 
    ${
      control.confirmCanceled || control.isFormDisabled
        ? "cursor-not-allowed"
        : "cursor-pointer"
    }`}
              onClick={() => {
                if (!control.confirmCanceled && !control.isFormDisabled) {
                  control.toggleShiftCanceledModal();
                }
              }}
            >
              <Checkbox
                className={`${
                  control.confirmCanceled || control.isFormDisabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onChange={() => {}}
                checked={control.confirmCanceled}
                disabled={control.confirmCanceled || control.isFormDisabled}
              />
              <div>This shift was canceled</div>
            </div>
          </div>
        </div>
        <button
          className={`text-white font-semibold py-3 px-6 w-full rounded-lg mt-4 ${
            control.isFormDisabled ||
            control.currentEmpShift?.reportedCanceled ||
            control.currentEmpShift?.didNotWork
              ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => control.SaveShiftTimes()}
          disabled={
            control.isFormDisabled ||
            control.currentEmpShift?.reportedCanceled ||
            control.currentEmpShift?.didNotWork
          }
        >
          Submit Time
        </button>

        {!control.currentEmpShift && (
          <p className="mt-4 text-red-500 font-semibold text-center">
            You have not signed up for this shift
          </p>
        )}


      </div>
    </>
  );
};
