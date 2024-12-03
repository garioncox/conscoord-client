import { GTextInputController } from "./gTextInputController";

const GEmailInput: React.FC<{
  label?: string;

  control: GTextInputController;
}> = ({ label, control, }) => {
  return (
    <>
      <label className="form-label d-flex flex-column flex-grow-1">
        {label}
        <input
          type="email"
          placeholder="example@email.com"
          className={`rounded shadow-inner p-2 text-black form-control ${
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
        />
        <p className="invalid-feedback text-red-500">{control.error}</p>
      </label>
    </>
  );
};

export default GEmailInput;
