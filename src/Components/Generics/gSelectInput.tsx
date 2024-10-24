import { GSelectInputController } from "./gSelectInputController";

const GSelectInput: React.FC<{
  label?: string;
  control: GSelectInputController;
}> = ({ label, control }) => {
  if (control.value) {
    control.setHasBeenTouched(true);
  }

  return (
    <>
      <label className="form-label d-flex flex-column flex-grow-1">
        {label}
        <select
          className={`form-control ${
            control.hasBeenTouched
              ? control.error
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          value={control.value}
          onChange={(e) => {
            control.setValue(e.target.value);
            control.setHasBeenTouched(true);
          }}
          onBlur={() => control.setHasBeenTouched(true)}
        >
          <option value="" disabled />
          {control.possibleValues.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <p className="invalid-feedback">{control.error}</p>
      </label>
    </>
  );
};

export default GSelectInput;
