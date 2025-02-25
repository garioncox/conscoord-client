import { Minus } from "lucide-react";
import GNumberInput from "./Generics/gNumberInput";
import { useGNumberInput } from "./Generics/control/gNumberInputController";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/control/gTextInputController";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { useAddShiftMutation } from "@/Functions/Queries/ShiftQueries";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { Dayjs } from "dayjs";
import CustomTimePicker from "./Generics/CustomTimePicker";
import { useCustomTimePickerControl } from "./Generics/control/CustomTimePickerControl";
import { useCustomDatePickerControl } from "./Generics/control/CustomDatePickerControl";
import CustomDatePicker from "./Generics/CustomDatePicker";
import Modal from "./Modal";

export const AddShift: React.FC<{
  projectId: number;
  toggleModal: () => void;
  isModalOpen: boolean;
}> = ({ projectId, toggleModal, isModalOpen }) => {
  const addShiftMutation = useAddShiftMutation(projectId);

  const locationControl = useGTextInput("", (v) =>
    v.length === 0 ? "*Required" : ""
  );
  const descriptionControl = useGTextInput("", () => "");
  const reqEmpControl = useGNumberInput(1, (v) => {
    if (v < 1 || v > 15) {
      return "Error";
    }
    return "";
  });
  const startTimeControl = useCustomTimePickerControl(
    null,
    (value: Dayjs | null) => (value ? "" : "*Required")
  );
  const endTimeControl = useCustomTimePickerControl(
    null,
    (value: Dayjs | null) => (value ? "" : "*Required")
  );
  const dateControl = useCustomDatePickerControl(null, (value: Dayjs | null) =>
    value ? "" : "*Required"
  );

  const validateShift = () => {
    return !(
      locationControl.error ||
      descriptionControl.error ||
      reqEmpControl.error ||
      startTimeControl.error ||
      endTimeControl.error ||
      dateControl.error
    );
  };

  const setControlsTouched = () => {
    locationControl.setHasBeenTouched(true);
    descriptionControl.setHasBeenTouched(true);
    reqEmpControl.setHasBeenTouched(true);
    startTimeControl.setHasBeenTouched(true);
    endTimeControl.setHasBeenTouched(true);
    dateControl.setHasBeenTouched(true);
  };

  function CreateShift() {
    setControlsTouched();

    if (validateShift()) {
      const shift: ShiftDTO = {
        StartTime: startTimeControl.value!.format("YYYY/MM/DD HH:mm:ss"),
        EndTime: endTimeControl.value!.format("YYYY/MM/DD HH:mm:ss"),
        Description: descriptionControl.value,
        Location: locationControl.value,
        RequestedEmployees: reqEmpControl.value,
        Status: "ACTIVE",
      };
      addShiftMutation.mutate({ shiftDTO: shift, projectId: projectId });
      toggleModal();
    }
  }

  return (
    <Modal isOpen={isModalOpen} onClose={toggleModal}>
      <p className="flex font-semibold text-2xl justify-center border-b pb-3">
        Add a shift
      </p>
      <div className="flex flex-row items-center border-b pb-8">
        <GTextInput label="Location" control={locationControl} maxLength={50} />
        <div className="w-1/2 items-center justify-center justify-items-center flex">
          <GNumberInput
            label="Requested Officers"
            control={reqEmpControl}
            minimum={1}
            maximum={15}
          />
        </div>
      </div>

      <div className="border-b pb-8">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="">
            <CustomDatePicker label="Start Date" control={dateControl} />
          </div>

          <div className="flex flex-row items-center space-x-2">
            <CustomTimePicker label="Start Time" control={startTimeControl} />
            <div className="pt-6">
              <Minus />
            </div>
            <CustomTimePicker label="End Time" control={endTimeControl} />
          </div>
        </LocalizationProvider>
      </div>

      <GTextInput
        label="Description"
        control={descriptionControl}
        maxLength={200}
        multiline={true}
        lines={4}
      />

      <div className="flex grow flex-row my-3">
        <button
          onClick={toggleModal}
          className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
        >
          Close
        </button>
        <button
          onClick={CreateShift}
          className="p-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Create Shift
        </button>
      </div>
    </Modal>
  );
};
