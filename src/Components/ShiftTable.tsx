import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { AddShift } from "./AddShift";
import { Button } from "./ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";
import React, { useState } from "react";
import { Shift } from "@/Data/Interfaces/Shift";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";

interface TableComponentProps {
  data: Shift[];
  setRowClicked: (id: number) => void;
  projectId: number;
}

export function ShiftTable({
  data,
  setRowClicked,
  projectId,
}: TableComponentProps) {
  const [addingCount, setAddingCount] = React.useState(0);
  const { data: employeeShifts, isLoading: employeeShiftsLoading } =
    useAllEmployeeShifts();
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

  return (
    <>
      <label className="mr-3">Sort By</label>
      <select
        className="text-black"
        onChange={(e) => {
          setSortValue(e.target.value);
        }}
      >
        <option value="" selected disabled>Choose A Sort Value</option>
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
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Requested Employees</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SortData().map((shift) => (
            <TableRow key={shift.id} onClick={() => setRowClicked(shift.id)}>
              <TableCell>{shift.location}</TableCell>
              <TableCell>{shift.startTime}</TableCell>
              <TableCell>{shift.endTime}</TableCell>
              <TableCell>{shift.description}</TableCell>
              <TableCell className="flex justify-center">
                {employeeShiftsLoading
                  ? "Loading..."
                  : employeeShifts?.filter((es) => es.shiftId == shift.id)
                      .length}{" "}
                / {shift.requestedEmployees}
              </TableCell>
              <TableCell>{shift.status}</TableCell>
            </TableRow>
          ))}
          {addingCount > 0 && <AddShift projectId={projectId} />}
        </TableBody>
      </Table>

      {addingCount === 0 && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setAddingCount(addingCount + 1)}
        >
          <CirclePlus className="h-16 w-16" />
        </Button>
      )}
      {addingCount >= 1 && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setAddingCount(addingCount - 1)}
        >
          <CircleMinus className="h-16 w-16" />
        </Button>
      )}
    </>
  );
}
