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
  const [confirmedNotWorked, setConfirmedNotWorked] = useState(false);

  const [isShiftCanceledModalOpen, setIsShiftCanceledModalOpen] =
    useState(false);
  const toggleShiftCanceledModal = () =>
    setIsShiftCanceledModalOpen(!isShiftCanceledModalOpen);
  const [confirmShiftCanceled, setConfirmShiftCanceled] = useState(false);

  useEffect(() => {
    if (!currentEmpShift) {
      return;
    }
    if (
      currentEmpShift.clockInTime === currentEmpShift.clockOutTime &&
      currentEmpShift.clockInTime === "00:00"
    ) {
      setConfirmedNotWorked(true);
    }

    if (currentEmpShift.notes === "Shift was reported as canceled") {
      setConfirmShiftCanceled(true);
    }
  }, [currentEmpShift]);

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
      employeeId: currentEmpShift.empId,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  }

  function SaveZeroedShiftTimes(): void {
    if (!(currentEmpShift && startTime && endTime)) {
      console.log("conditions were not met");
      return;
    }

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      clockInTime: "00:00",
      clockOutTime: "00:00",
      employeeId: currentEmpShift.empId,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  }

  function SetShiftDescription(s: string): void {
    if (!(currentEmpShift && startTime && endTime)) {
      console.log("conditions were not met");
      return;
    }

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      clockInTime: currentEmpShift.clockInTime,
      clockOutTime: currentEmpShift.clockOutTime,
      employeeId: currentEmpShift.empId,
      shiftId: currentEmpShift.shiftId,
      notes: s,
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
            disabled={isFormDisabled}
          />
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            disabled={isFormDisabled}
          />
        </LocalizationProvider>

        <div>
          <div
            className={`flex flex-row space-x-3 ${
              confirmedNotWorked || isFormDisabled
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => {
              if (!confirmedNotWorked) {
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
              onChange={() => {}}
              checked={confirmedNotWorked}
              disabled={confirmedNotWorked || isFormDisabled}
            />
            <div>I did not work this shift</div>
          </div>
          
          <div
            className={`flex flex-row space-x-3 ${
              confirmedNotWorked ? "inline" : "hidden"
            } 
            ${
              confirmShiftCanceled || isFormDisabled
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => {
              if (!confirmShiftCanceled) {
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
          isFormDisabled
            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => SaveShiftTimes()}
        disabled={isFormDisabled}
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
            <p>
              Are you sure you want to mark this shift as not completed? You
              cannot undo this action.
            </p>
          </div>
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
                SaveZeroedShiftTimes();
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
              Are you sure you want to mark this shift as canceled? You cannot
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
                SetShiftDescription("Shift was reported as canceled");
                setConfirmShiftCanceled(true);
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
