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
import { CombineTime } from "@/Functions/CombineTime";
import { useLoggedInEmployee } from "@/Functions/Queries/EmployeeQueries";
import { useState } from "react";

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
  const { data: loggedInEmployee } = useLoggedInEmployee();
  const [sortValue, setSortValue] = useState<string>("");

  const sortMethods: { [key: string]: (a: Shift, b: Shift) => number } = {
    startDateAsc: (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    startDateDesc: (a, b) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    endDateAsc: (a, b) =>
      new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
    endDateDesc: (a, b) =>
      new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    Location: (a, b) => a.location.localeCompare(b.location),
  };

  const SortData = () => {
    const sorted = [...data];
    const sortFunction = sortMethods[sortValue];
    if (sortFunction) {
      sorted.sort(sortFunction);
    }
    return sorted;
  };

  const TakeShift = (shiftId: number) => {
    addMutation.mutate(shiftId);
  };

  if (shiftsLoading) {
    return <Spinner />;
  }

  return (
    <>
      <label className="mr-3">Sort By</label>
      <select
        className="text-black"
        onChange={(e) => {
          setSortValue(e.target.value);
        }}
      >
        <option value="" selected disabled>
          Choose A Sort Value
        </option>
        <option value="Location">Location</option>
        <option value="startDateAsc">Start Date Ascending</option>
        <option value="startDateDesc">Start Date Descending</option>
        <option value="endDateAsc">End Date Ascending</option>
        <option value="endDateDesc">End Date Descending</option>
      </select>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Shifts Fulfilled</TableHead>
            {loggedInEmployee?.roleid != 3 ? (
              <TableHead>Take Shift</TableHead>
            ) : (
              ""
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {SortData().map((shift) => (
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
              {loggedInEmployee?.roleid != 3 ? (
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
              ) : (
                ""
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
