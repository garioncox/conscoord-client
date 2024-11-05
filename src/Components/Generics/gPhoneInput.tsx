import { GTextInputController } from "./gTextInputController";

const GPhoneInput: React.FC<{
  label?: string;
  control: GTextInputController;

}> = ({ label,  control }) => {
    function formatPhoneNumber(value: string) {
        // Remove non-digit characters
        const digits = value.replace(/\D/g, "");
        let formattedValue = "";
    
        if (digits.length > 0) {
          formattedValue += digits.substring(0, 3); // Area code
        }
        if (digits.length > 3) {
          formattedValue += "-" + digits.substring(3, 6); // First 3 digits
        }
        if (digits.length > 6) {
          formattedValue += "-" + digits.substring(6, 10); // Last 4 digits
        }
        return formattedValue;
      }

  return (
    <>
      <label className="form-label d-flex flex-column flex-grow-1">
        {label}
        
        <input
          type="text"
          placeholder={"555-555-5555"}
          className={`form-control ${
            control.hasBeenTouched
              ? control.error
                ? "is-invalid"
                : "is-valid"
              : ""
          }`}
          value={control.value}
          onChange={(e) => {
            const formattedPhone = formatPhoneNumber(e.target.value);
            control.setValue(formattedPhone);
            control.setHasBeenTouched(true);
          }}
          onBlur={() => control.setHasBeenTouched(true)}
        />
        <p className="invalid-feedback">{control.error}</p>
      </label>
    </>
  );
};

export default GPhoneInput;
