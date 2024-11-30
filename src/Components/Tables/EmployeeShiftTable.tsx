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
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";
import { CombineTime } from "@/Functions/CombineTime";
import { useEffect, useState } from "react";
import ShiftSort from "../Sorting/ShiftSort";
import PermissionComponentLock from "../Auth/PermissionComponentLock";
import { PSO_ROLE } from "../Auth/PermissionLock";

export function EmployeeShiftTable({
  data,
  setRowClicked,
}: {
  data: Shift[];
  setRowClicked: (id: number) => void;
}) {
  const { data: userShifts, isLoading: shiftsLoading } =
    useClaimedShiftsForLoggedInUser();
  const { data: employeeShifts, isLoading: employeeShiftsLoading } =
    useAllEmployeeShifts();
  const addMutation = useClaimShiftMutation();
  const [sortedData, setSortedData] = useState<Shift[]>(data);

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  const TakeShift = (shiftId: number) => {
    addMutation.mutate(shiftId);
  };

  if (shiftsLoading) {
    return <Spinner />;
  }

  return (
    <>
      <ShiftSort data={data} onSortChange={setSortedData} />
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
          {sortedData.map((shift) => (
            <TableRow
              key={shift.id}
              className="hover:bg-slate-200 py-4"
              onClick={() => setRowClicked(shift.id)}
            >
              <TableCell className="px-2">{shift.location}</TableCell>
              <TableCell className="px-2">
                {CombineTime(shift.startTime, shift.endTime)}
              </TableCell>
              <TableCell className="px-2">{shift.description}</TableCell>
              <TableCell className="px-2">
                <p className="flex justify-center">
                  {employeeShiftsLoading
                    ? "Loading..."
                    : employeeShifts?.filter((es) => es.shiftId == shift.id)
                        .length}{" "}
                  / {shift.requestedEmployees}
                </p>
              </TableCell>
              <PermissionComponentLock roles={[PSO_ROLE]}>
                <TableCell className="flex justify-center px-2">
                  {userShifts?.some(
                    (userShift) => userShift.id === shift.id
                  ) ? (
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      className="bg-emerald-400 group rounded-full cursor-default hover:bg-emerald-400"
                      size="icon"
                    >
                      <Check className="h-16 w-16 text-white" strokeWidth={5} />
                    </Button>
                  ) : (
                    <Button
                      className="rounded-xl bg-tertiary text-slate-500 border-2 border-slate-500 hover:text-white hover:bg-blue-500 hover:border-blue-500"
                      onClick={(e) => {
                        TakeShift(shift.id);
                        e.stopPropagation();
                      }}
                      size="icon"
                    >
                      <Plus className="h-16 w-16" strokeWidth={3} />
                    </Button>
                  )}
                </TableCell>
              </PermissionComponentLock>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
