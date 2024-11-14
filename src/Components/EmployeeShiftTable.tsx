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
  useAllShiftsForLoggedInUser,
  useClaimShiftMutation,
} from "@/Functions/Queries/ShiftQueries";
import { Spinner } from "./Spinner";
import { useCustomToast } from "./Toast";
import { CombineTime } from "@/Functions/CombineTime";

export function EmployeeShiftTable({ data }: { data: Shift[] }) {
  const { data: userShifts, isLoading } = useAllShiftsForLoggedInUser();
  const addMutation = useClaimShiftMutation();

  const TakeShift = (shiftId: number) => {
    addMutation.mutate(shiftId);
  };

  if (isLoading) {
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
            <TableHead>Requested Employees</TableHead>
            <TableHead>Take Shift</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((shift) => (
            <TableRow key={shift.id} className="hover:bg-slate-200">
              <TableCell>{shift.location}</TableCell>
              <TableCell>{shift.startTime}</TableCell>
              <TableCell>{shift.endTime}</TableCell>
              <TableCell>{shift.description}</TableCell>
              <TableCell>{shift.requestedEmployees}</TableCell>

              <TableCell>
                {userShifts?.some((userShift) => userShift.id === shift.id) ? (
                  <Button
                    className="group border-green-400 text-green-400 border-2 rounded-md"
                    variant="outline"
                    size="icon"
                  >
                    <Check className="h-16 w-16" />
                  </Button>
                ) : (
                  <Button
                    className="border-slate-300 border-2 rounded-md hover:border-blue-300 hover:text-blue-400"
                    onClick={() => TakeShift(shift.id)}
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
