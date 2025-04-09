import { Shift } from "@/Data/Interfaces/Shift";
import { Plus } from "lucide-react";
import {
  useClaimedShiftsForLoggedInUser,
  useClaimShiftMutation,
} from "@/Functions/Queries/ShiftQueries";
import { Spinner } from "../Spinner";
import { CombineTime } from "@/Functions/CombineTime";
import { FC, useEffect, useState } from "react";
import PermissionComponentLock from "../Auth/PermissionComponentLock";
import { PSO_ROLE } from "../Auth/PermissionLock";
import { useShiftsFulfilledUtils } from "../ShiftsFulfilledHook";

export const ShiftTable: FC<{
  data: Shift[];
  setRowClicked: (id: number) => void;
}> = ({ data, setRowClicked }) => {
  const { data: userShifts, isLoading: shiftsLoading } =
    useClaimedShiftsForLoggedInUser();
  const addMutation = useClaimShiftMutation();
  const [sortedData, setSortedData] = useState<Shift[]>(data);
  const { shiftFractionString, shiftFractionStyles, shiftFraction } =
    useShiftsFulfilledUtils();
  const [isClaimingShift, setIsClaimingShift] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!addMutation.isPending) {
      setIsClaimingShift(false);
    }
  }, [addMutation.isPending]);

  const TakeShift = (shiftId: number) => {
    addMutation.mutate(shiftId);
  };

  if (shiftsLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div>
        <div className="px-3 font-semibold border-b-2 border-slate-200">
          <div className="grid grid-cols-11 gap-10 pb-3">
            <p className="col-span-3">Location</p>
            <p className="col-span-2">Time</p>
            <p className="col-span-3">Description</p>
            <p className="text-end col-span-2">Shifts Fulfilled</p>
            <PermissionComponentLock roles={[PSO_ROLE]}>
              <div className="text-end col-span-1">Take Shift</div>
            </PermissionComponentLock>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[400px] xl:h-[50vh] xl:max-h-full">
          {sortedData.map((shift) => {
            const isShiftFull =
              shiftFraction(shift) >= 1 || shift.status === "ARCHIVED";
            const isOverlapping = userShifts?.some(
              (s) =>
                (shift.startTime > s.startTime &&
                  shift.startTime < s.endTime) ||
                (shift.endTime > s.startTime && shift.endTime < s.endTime)
            );

            const buttonClass =
              isShiftFull || isOverlapping
                ? "text-slate-300 border-slate-300 hover:bg-slate-100 cursor-not-allowed"
                : "text-slate-500 border-slate-500 hover:text-white hover:bg-blue-500 hover:border-blue-500";

            const buttonTitle =
              shift.status === "ARCHIVED"
                ? "This shift has been archived"
                : isShiftFull
                ? "Shift is full"
                : isOverlapping
                ? "Overlapping shift"
                : "Take this shift";

            const handleTakeShift = () => {
              setIsClaimingShift(true);
              if (
                !isShiftFull &&
                shift.status !== "ARCHIVED" &&
                !isOverlapping
              ) {
                TakeShift(shift.id);
              } else {
                setIsClaimingShift(false);
              }
            };

            let debounceTimeout: ReturnType<typeof setTimeout>;

            const handleDebouncedTakeShift = (
              e: React.MouseEvent<HTMLButtonElement>
            ) => {
              e.stopPropagation();
              if (debounceTimeout) clearTimeout(debounceTimeout);

              debounceTimeout = setTimeout(() => {
                handleTakeShift();
              }, 150);
            };

            return (
              <div
                key={shift.id}
                className="grid grid-cols-11 gap-10 py-5 px-3 hover:bg-slate-200 hover:cursor-pointer"
                onClick={() => setRowClicked(shift.id)}
              >
                <div className="col-span-3">{shift.location}</div>
                <div className="col-span-2">
                  {CombineTime(shift.startTime, shift.endTime)}
                </div>
                <div className="col-span-3">{shift.description}</div>
                <div className="col-span-2">
                  <p
                    className={`flex justify-end ${shiftFractionStyles(shift)}`}
                  >
                    {shiftFractionString(shift)}
                  </p>
                </div>
                <PermissionComponentLock roles={[PSO_ROLE]}>
                  <div className="flex justify-end pe-2 col-span-1">
                    <button
                      className={`rounded-xl bg-tertiary ${buttonClass} border-2 h-10 w-10 min-w-[2.5rem] flex items-center justify-center flex-shrink-0`}
                      title={buttonTitle}
                      onClick={handleDebouncedTakeShift}
                      disabled={addMutation.isPending || isClaimingShift}
                    >
                      <Plus className="h-4 w-4" strokeWidth={3} />
                    </button>
                  </div>
                </PermissionComponentLock>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
