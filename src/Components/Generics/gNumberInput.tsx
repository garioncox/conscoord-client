import { GNumberInputController } from "./gNumberInputController";

const GNumberInput: React.FC<{
  label?: string;
  control: GNumberInputController;
  minimum?: number;
  maximum?: number;
}> = ({ label, control, minimum, maximum }) => {
  return (
    <div className="relative pb-5 pt-8">
      <label className="absolute top-0 left-2">{label}</label>
      <div>
        <input
          type="number"
          className="rounded shadow-inner p-2"
          min={minimum ?? 0}
          max={maximum ?? 10}
          value={control.value}
          onChange={(e) => {
            control.setValue(Number(e.target.value));
            control.setHasBeenTouched(true);
          }}
          onBlur={() => control.setHasBeenTouched(true)}
        />
      </div>
      {control.hasBeenTouched && (
        <p className="absolute text-sm text-red-500 left-3">{control.error}</p>
      )}
    </div>
  );
};

export default GNumberInput;
