import { useGTextInput } from "@/Components/Generics/control/gTextInputController";
import GTextInput from "@/Components/Generics/gTextInput";
import Modal from "@/Components/Modal";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useEmpShiftMutation } from "@/Functions/Queries/EmployeeShiftQueries";
import { Checkbox } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface PSOViewProps {
  currentEmpShift: EmployeeShift | undefined;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  isFormDisabled: boolean;
  setStartTime: Dispatch<SetStateAction<Dayjs | null>>;
  setEndTime: Dispatch<SetStateAction<Dayjs | null>>;
}

const PSOView: React.FC<PSOViewProps> = ({
  currentEmpShift,
  startTime,
  endTime,
  isFormDisabled,
  setStartTime,
  setEndTime,
}) => {
  const empShiftMutation = useEmpShiftMutation();
  const [isShiftNotWorkedModalOpen, setIsShiftNotWorkedModalOpen] =
    useState(false);
  const toggleShiftNotWorkedModal = () =>
    setIsShiftNotWorkedModalOpen(!isShiftNotWorkedModalOpen);
  const [confirmedNotWorked, setConfirmedNotWorked] = useState(
    currentEmpShift ? currentEmpShift.didNotWork : false
  );

  const [isShiftCanceledModalOpen, setIsShiftCanceledModalOpen] =
    useState(false);
  const toggleShiftCanceledModal = () =>
    setIsShiftCanceledModalOpen(!isShiftCanceledModalOpen);
  const [confirmShiftCanceled, setConfirmShiftCanceled] = useState(
    currentEmpShift ? currentEmpShift.reportedCanceled : false
  );

  useEffect(() => {
    if (currentEmpShift) {
      setConfirmShiftCanceled(currentEmpShift.reportedCanceled);
      setConfirmedNotWorked(currentEmpShift.didNotWork);
    }
  }, [currentEmpShift]);

  const noteControl = useGTextInput("", () => "");

  function SaveShiftTimes(): void {
    if (!(currentEmpShift && startTime && endTime)) {
      console.log("conditions were not met");
      return;
    }

    const startPad = String(startTime.get("minute")).length <= 1 ? "0" : "";
    const endPad = String(endTime.get("minute")).length <= 1 ? "0" : "";

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      clockInTime: `${startTime.get("hour")}:${startPad}${startTime.get(
        "minute"
      )}`,
      clockOutTime: `${endTime.get("hour")}:${endPad}${endTime.get("minute")}`,
      didNotWork: currentEmpShift.didNotWork,
      empId: currentEmpShift.empId,
      hasbeeninvoiced: currentEmpShift.hasbeeninvoiced,
      reportedCanceled: currentEmpShift.reportedCanceled,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  }

  function MarkShiftNotWorked(): void {
    if (!(currentEmpShift && startTime && endTime)) {
      console.log("conditions were not met");
      return;
    }

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      didNotWork: true,
      clockInTime: null,
      clockOutTime: null,
      empId: currentEmpShift.empId,
      hasbeeninvoiced: currentEmpShift.hasbeeninvoiced,
      notes: noteControl.value ?? "",
      reportedCanceled: currentEmpShift.reportedCanceled,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  }

  function ReportShiftCanceled(): void {
    if (!(currentEmpShift && startTime && endTime)) {
      console.log("conditions were not met");
      return;
    }

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      didNotWork: true,
      clockInTime: null,
      clockOutTime: null,
      empId: currentEmpShift.empId,
      hasbeeninvoiced: currentEmpShift.hasbeeninvoiced,
      notes: noteControl.value ?? "",
      reportedCanceled: true,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  }

  return (
    <div
      className={`mt-7 justify-center w-full ${
        !currentEmpShift ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="font-semibold text-xl pb-5 text-center lg:text-left">
        Log Time
      </div>
      <div className="flex flex-col items-center space-y-5 lg:flex-row lg:space-y-0 lg:space-x-3">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            disabled={
              isFormDisabled ||
              currentEmpShift?.reportedCanceled ||
              currentEmpShift?.didNotWork
            }
          />
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            disabled={
              isFormDisabled ||
              currentEmpShift?.reportedCanceled ||
              currentEmpShift?.didNotWork
            }
          />
        </LocalizationProvider>

        {/* Did not work + Canceled checkboxes */}
        <div>
          <div
            className={`flex flex-row items-center ${
              confirmedNotWorked || isFormDisabled
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => {
              if (!confirmedNotWorked && !isFormDisabled) {
                toggleShiftNotWorkedModal();
              }
            }}
          >
            <Checkbox
              className={`${
                confirmedNotWorked || isFormDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              checked={confirmedNotWorked}
              disabled={confirmedNotWorked || isFormDisabled}
            />
            <div>I did not work this shift</div>
          </div>

          <div
            className={`flex flex-row items-center ${
              confirmedNotWorked ? "inline" : "hidden"
            } 
            ${
              confirmShiftCanceled || isFormDisabled
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => {
              if (!confirmShiftCanceled && !isFormDisabled) {
                toggleShiftCanceledModal();
              }
            }}
          >
            <Checkbox
              className={`${
                confirmShiftCanceled || isFormDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onChange={() => {}}
              checked={confirmShiftCanceled}
              disabled={confirmShiftCanceled || isFormDisabled}
            />
            <div>This shift was canceled</div>
          </div>
        </div>
      </div>
      <button
        className={`text-white font-semibold py-3 px-6 w-full rounded-lg mt-4 ${
          isFormDisabled ||
          currentEmpShift?.reportedCanceled ||
          currentEmpShift?.didNotWork
            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => SaveShiftTimes()}
        disabled={
          isFormDisabled ||
          currentEmpShift?.reportedCanceled ||
          currentEmpShift?.didNotWork
        }
      >
        Submit Time
      </button>

      {!currentEmpShift && (
        <p className="mt-4 text-red-500 font-semibold text-center">
          You have not signed up for this shift
        </p>
      )}

      <Modal
        isOpen={isShiftNotWorkedModalOpen}
        onClose={toggleShiftNotWorkedModal}
      >
        <div className="ps-5 pe-2">
          <div>
            <p>Are you sure you want to mark this shift as not completed?</p>
            <p className="text-red-500 text-md ps-5">
              *You cannot undo this action.
            </p>
          </div>
          <GTextInput
            label="Notes"
            control={noteControl}
            maxLength={500}
            multiline={true}
            lines={4}
          />
          <div className="flex grow flex-row mt-5">
            <button
              onClick={toggleShiftNotWorkedModal}
              className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
            >
              Close
            </button>
            <button
              onClick={() => {
                setConfirmedNotWorked(true);
                MarkShiftNotWorked();
                toggleShiftNotWorkedModal();
              }}
              className="p-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Yes, I did not work it
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isShiftCanceledModalOpen}
        onClose={toggleShiftCanceledModal}
      >
        <div className="ps-5 pe-2">
          <div>
            <p>
              Are you sure you want to report this shift as canceled? You cannot
              undo this action.
            </p>
          </div>
          <div className="flex grow flex-row mt-5">
            <button
              onClick={toggleShiftCanceledModal}
              className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
            >
              Close
            </button>
            <button
              onClick={() => {
                toggleShiftCanceledModal();
                setConfirmShiftCanceled(true);
                ReportShiftCanceled();
              }}
              className="p-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Yes, shift was canceled
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PSOView;
