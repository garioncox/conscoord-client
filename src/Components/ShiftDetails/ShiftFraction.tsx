import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";
import { ProgressCircle } from "./ProgressCircle";
import { useShiftsFulfilledUtils } from "../ShiftsFulfilledHook";

export const ShiftFraction = ({
  control,
}: {
  control: ReturnType<typeof useShiftDetailsControl>;
}) => {
  const shiftsFulfilledUtils = useShiftsFulfilledUtils();

  return (
    <>
      <ProgressCircle
        usePercentage={true}
        progress={
          (shiftsFulfilledUtils.shiftsClaimed(control.shiftFromParam!) /
            shiftsFulfilledUtils.shiftsAvailable(control.shiftFromParam!)) *
          100
        }
      />
      <div className="mt-5">
        {control.shiftFractionString(control.shiftFromParam!)} Shifts Filled
      </div>
    </>
  );
};
