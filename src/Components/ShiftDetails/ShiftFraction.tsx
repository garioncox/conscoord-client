import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";

export const ShiftFraction = ({ id }: { id: number }) => {
  const control = useShiftDetailsControl(id);

  return (
    <>
      <div className="justify-center p-4 border rounded-lg shadow h-1/2">
        {control.shiftFractionString(control.shiftFromParam!)} Shifts Filled
      </div>
    </>
  );
};
