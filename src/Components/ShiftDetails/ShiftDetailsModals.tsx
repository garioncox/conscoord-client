import Modal from "@/Components/Modal";
import GTextInput from "@/Components/Generics/gTextInput";
import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";

export const DidNotWorkModal = ({ id }: { id: number }) => {
  const control = useShiftDetailsControl(id);

  return (
    <Modal
      isOpen={control.isNotWorkedModalOpen}
      onClose={control.toggleShiftNotWorkedModal}
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
  );
};

export const ReportCanceledModal = ({ id }: { id: number }) => {
  const control = useShiftDetailsControl(id);

  return (
    <Modal
      isOpen={control.isCanceledModalOpen}
      onClose={control.toggleShiftCanceledModal}
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
  );
};
