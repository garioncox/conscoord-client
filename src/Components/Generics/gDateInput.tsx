import { GDateInputController } from "./gDateInputController";

const GDateInput: React.FC<{
  label?: string;
  control: GDateInputController;
}> = ({ label, control }) => {
  return (
    <>
      <label className="form-label d-flex flex-column flex-grow-1">
        {label}
        <input
          type="date"
          value={control.value}
          onChange={(e) => {
            control.setValue(e.target.value);
            control.setHasBeenTouched(true);
          }}
          className={`form-control ${
            control.hasBeenTouched
              ? control.error
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          onBlur={() => control.setHasBeenTouched(true)}
        />
        <p className="invalid-feedback">{control.error}</p>
      </label>
    </>
  );
};

export default GDateInput;
