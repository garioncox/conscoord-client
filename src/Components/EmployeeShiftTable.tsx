import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Shift } from "@/Data/Interfaces/Shift";
import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";
import {
  useClaimedShiftsForLoggedInUser,
  useClaimShiftMutation,
} from "@/Functions/Queries/ShiftQueries";
import { Spinner } from "./Spinner";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";

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

  const TakeShift = (shiftId: number) => {
    addMutation.mutate(shiftId);
  };

  if (shiftsLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Shifts Fulfilled</TableHead>
            <TableHead>Take Shift</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((shift) => (
            <TableRow
              key={shift.id}
              className="hover:bg-slate-200"
              onClick={() => setRowClicked(shift.id)}
            >
              <TableCell>{shift.location}</TableCell>
              <TableCell>{shift.startTime}</TableCell>
              <TableCell>{shift.endTime}</TableCell>
              <TableCell>{shift.description}</TableCell>
              <TableCell>
                {employeeShiftsLoading
                  ? "Loading..."
                  : employeeShifts?.filter((es) => es.shiftId == shift.id)
                      .length}{" "}
                / {shift.requestedEmployees}
              </TableCell>
              <TableCell>
                {userShifts?.some((userShift) => userShift.id === shift.id) ? (
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    className="group border-green-400 text-green-400 border-2 rounded-md cursor-default"
                    variant="outline"
                    size="icon"
                  >
                    <Check className="h-16 w-16" />
                  </Button>
                ) : (
                  <Button
                    className="border-slate-300 border-2 rounded-md hover:border-blue-300 hover:text-blue-400"
                    onClick={(e) => {
                      TakeShift(shift.id);
                      e.stopPropagation();
                    }}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="h-16 w-16" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
