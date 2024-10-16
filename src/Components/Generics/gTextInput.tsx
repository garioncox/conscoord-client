import { gTextInpurController } from "./gTextInputController";

const gTextInput: React.FC<{
  label?: string;
  control: gTextInpurController;
  minLength?: number;
  maxLength?: number;
}> = ({ label, control, minLength, maxLength }) => {
  return (
    <>
      <label className="form-label">
        {label}
        <input
          type="text"
          className={`form-control ${
            control.hasBeenTouched
              ? control.error
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          minLength={minLength ?? 3}
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

export default gTextInput;
