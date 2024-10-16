import { GTextInputController } from "./gTextInputController";

export const defaultValidation = (s: string) => {
  return s === "" ? "Field is required" : "";
};

const GTextInput: React.FC<{
  label?: string;
  placeholder?: string;
  control: GTextInputController;
  minLength?: number;
  maxLength?: number;
}> = ({ label, placeholder, control, minLength, maxLength }) => {
  return (
    <>
      <label className="form-label d-flex flex-column flex-grow-1">
        {label}
        <input
          type="text"
          placeholder={placeholder ?? ""}
          className={`form-control ${
            control.hasBeenTouched
              ? control.error
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          minLength={minLength ?? 0}
          maxLength={maxLength ?? 30}
          value={control.value}
          onChange={(e) => {
            control.setValue(e.target.value);
          }}
          onBlur={() => control.setHasBeenTouched(true)}
        />
        <p className="invalid-feedback">{control.error}</p>
      </label>
    </>
  );
};

export default GTextInput;
