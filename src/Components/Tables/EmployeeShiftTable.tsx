import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Shift } from "@/Data/Interfaces/Shift";
import { Button } from "../ui/button";
import { Check, Plus } from "lucide-react";
import {
  useClaimedShiftsForLoggedInUser,
  useClaimShiftMutation,
} from "@/Functions/Queries/ShiftQueries";
import { Spinner } from "../Spinner";
import { CombineTime } from "@/Functions/CombineTime";
import { useEffect, useState } from "react";
import PermissionComponentLock from "../Auth/PermissionComponentLock";
import { PSO_ROLE } from "../Auth/PermissionLock";
import { useShiftsFulfilledUtils } from "../ShiftsFulfilledHook";
import { useAuth } from "react-oidc-context";

export function EmployeeShiftTable({
  data,
  setRowClicked,
}: {
  data: Shift[];
  setRowClicked: (id: number) => void;
}) {
  const { data: userShifts, isLoading: shiftsLoading } =
    useClaimedShiftsForLoggedInUser();
  const addMutation = useClaimShiftMutation();
  const [sortedData, setSortedData] = useState<Shift[]>(data);
  const { shiftFractionString, shiftFractionStyles, shiftFraction } =
    useShiftsFulfilledUtils();
  const { isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  const TakeShift = (shiftId: number) => {
    addMutation.mutate(shiftId);
  };

  if (shiftsLoading || authLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Shifts Fulfilled</TableHead>
            <PermissionComponentLock roles={[PSO_ROLE]}>
              <TableHead>Take Shift</TableHead>
            </PermissionComponentLock>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData
            .filter((e) => new Date(e.endTime) >= new Date() && shiftFraction(e) < 1)
            .map((shift) => {
              const isShiftTaken = userShifts?.some(
                (userShift) => userShift.id === shift.id
              );
              const isShiftFull =
                shiftFraction(shift) >= 1 || shift.status === "ARCHIVED";
              const isOverlapping = userShifts?.some(
                (userShift) =>
                  userShift.startTime >= shift.startTime &&
                  userShift.endTime <= shift.endTime
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

              const handleTakeShift = (
                e: React.MouseEvent<HTMLButtonElement>
              ) => {
                e.stopPropagation();
                if (
                  !isShiftFull &&
                  shift.status !== "ARCHIVED" &&
                  !isOverlapping
                ) {
                  TakeShift(shift.id);
                }
              };

              return (
                <TableRow
                  key={shift.id}
                  className="hover:bg-slate-200 py-4 hover:cursor-pointer"
                  onClick={() => setRowClicked(shift.id)}
                >
                  <TableCell className="px-2">{shift.location}</TableCell>
                  <TableCell className="px-2">
                    {CombineTime(shift.startTime, shift.endTime)}
                  </TableCell>
                  <TableCell className="px-2">{shift.description}</TableCell>
                  <TableCell className="px-2">
                    <p
                      className={`flex justify-center ${shiftFractionStyles(
                        shift
                      )}`}
                    >
                      {shiftFractionString(shift)}
                    </p>
                  </TableCell>
                  <PermissionComponentLock roles={[PSO_ROLE]}>
                    <TableCell className="flex justify-center px-2">
                      {isShiftTaken ? (
                        <Button
                          onClick={(e) => e.stopPropagation()}
                          className="bg-emerald-400 group rounded-full cursor-default hover:bg-emerald-400"
                          size="icon"
                        >
                          <Check
                            className="h-16 w-16 text-white"
                            strokeWidth={5}
                          />
                        </Button>
                      ) : (
                        <Button
                          className={`rounded-xl bg-tertiary ${buttonClass} border-2`}
                          title={buttonTitle}
                          onClick={handleTakeShift}
                          size="icon"
                        >
                          <Plus className="h-16 w-16" strokeWidth={3} />
                        </Button>
                      )}
                    </TableCell>
                  </PermissionComponentLock>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}
