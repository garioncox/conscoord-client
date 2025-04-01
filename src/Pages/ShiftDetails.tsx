import { useParams } from "react-router-dom";
import { Spinner } from "@/Components/Spinner";
import { useShiftDetailsControl } from "./Control/ShiftDetailsControl";
import GTextInput from "@/Components/Generics/gTextInput";
import { Checkbox } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Modal from "@/Components/Modal";
import PermissionComponentLock from "@/Components/Auth/PermissionComponentLock";
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  PSO_ROLE,
} from "@/Components/Auth/PermissionLock";

export const ShiftDetails = () => {
  const { id } = useParams();
  const control = useShiftDetailsControl(Number(id));

  if (control.isLoading || !control.shiftFromParam) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="border space-y-2 border-gray-300 rounded-lg p-6 max-w-md mx-auto shadow-md bg-white">
        <p className="text-xl font-semibold mb-4">Shift Details</p>
        <p>{control.shiftFromParam.location}</p>
        <p>{control.shiftFromParam.startTime}</p>
        <p>{control.shiftFromParam.endTime}</p>
        <p>{control.shiftFromParam.description}</p>
        <p
          className={`font-semibold ${control.shiftFractionStyles(
            control.shiftFromParam
          )}`}
        >
          {control.shiftFractionString(control.shiftFromParam)} Shifts Filled
        </p>
      </div>

      <PermissionComponentLock roles={[PSO_ROLE]}>
        <div
          className={`mt-7 justify-center w-full ${
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
                  if (!control.confirmedNotWorked && !control.isFormDisabled) {
                    control.toggleShiftNotWorkedModal();
                  }
                }}
              >
                <Checkbox
                  className={`${
                    control.confirmedNotWorked || control.isFormDisabled
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  checked={control.confirmedNotWorked}
                  disabled={
                    control.confirmedNotWorked || control.isFormDisabled
                  }
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

          <Modal
            isOpen={control.isNotWorkedModalOpen}
            onClose={control.toggleShiftNotWorkedModal}
          >
            <div className="ps-5 pe-2">
              <div>
                <p>
                  Are you sure you want to mark this shift as not completed?
                </p>
                <p className="text-red-500 text-md ps-5">
                  *You cannot undo this action.
                </p>
              </div>
              <GTextInput
                label="Notes"
                control={control.noteControl}
                maxLength={500}
                multiline={true}
                lines={4}
              />
              <div className="flex grow flex-row mt-5">
                <button
                  onClick={control.toggleShiftNotWorkedModal}
                  className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    control.setConfirmedNotWorked(true);
                    control.MarkShiftNotWorked();
                    control.toggleShiftNotWorkedModal();
                  }}
                  className="p-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Yes, I did not work it
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={control.isCanceledModalOpen}
            onClose={control.toggleShiftCanceledModal}
          >
            <div className="ps-5 pe-2">
              <div>
                <p>
                  Are you sure you want to report this shift as canceled? You
                  cannot undo this action.
                </p>
              </div>
              <div className="flex grow flex-row mt-5">
                <button
                  onClick={control.toggleShiftCanceledModal}
                  className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    control.toggleShiftCanceledModal();
                    control.setConfirmCanceled(true);
                    control.ReportShiftCanceled();
                  }}
                  className="p-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Yes, shift was canceled
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </PermissionComponentLock>

      <div>
        <div className="mt-10 mb-5 text-4xl font-bold">
          Signed Up Employees:
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-slate-300">
            <thead className="bg-slate-200">
              <tr>
                <th className="border border-slate-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-slate-300 px-4 py-2 text-left">
                  Email
                </th>
                <th className="border border-slate-300 px-4 py-2 text-left">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {control.signedUpEmployees?.map((s, index) => (
                <tr key={index} className="bg-white even:bg-slate-100">
                  <td className="border border-slate-300 px-4 py-2">
                    {s.name}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    {s.email}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    {s.phonenumber}
                  </td>
                </tr>
              ))}
              {Array.from({
                length:
                  control.shiftFromParam.requestedEmployees -
                  (control.signedUpEmployees?.length ?? 0),
              }).map((_, index) => {
                return (
                  <tr
                    key={`empty-${index}`}
                    className="bg-white even:bg-slate-100"
                  >
                    <td className="border border-slate-300 px-4 py-2">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      &nbsp;
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      &nbsp;
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PermissionComponentLock roles={[CLIENT_ROLE, ADMIN_ROLE]}>
            <div className="mt-10 flex justify-end">
              <button
                onClick={control.archiveShift}
                disabled={control.shiftFromParam?.status === "ARCHIVED"}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:opacity-30"
              >
                Cancel Shift
              </button>
            </div>
          </PermissionComponentLock>
        </div>
      </div>
    </div>
  );
};
