import { GNumberInputController } from "./gNumberInputController";

const GNumberInput: React.FC<{
  label?: string;
  control: GNumberInputController;
  minimum?: number;
  maximum?: number;
}> = ({ label, control, minimum, maximum }) => {
  return (
    <>
      <label className="form-label d-flex flex-column flex-grow-1">
        {label}
        <input
          type="number"
          value={control.value}
          onChange={(e) => {
            control.setValue(Number(e.target.value));
            control.setHasBeenTouched(true);
          }}
          onBlur={() => control.setHasBeenTouched(true)}
          className={`form-control ${
            control.hasBeenTouched
              ? control.error
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          min={minimum ?? 0}
          max={maximum ?? 10}
        />
        <p className="invalid-feedback">{control.error}</p>
      </label>
    </>
  );
};

export default GNumberInput;
