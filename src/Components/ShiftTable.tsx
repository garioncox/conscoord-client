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
import { useState } from "react";
import { Shift } from "@/Data/Interfaces/Shift";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useAllProjects } from "@/Functions/ProjectRequests";

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
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { data: employeeShifts, isLoading } = useAllEmployeeShifts();
  const projects = useAllProjects();
  const project = projects.data?.find((p) => p.id === projectId);

  const getNumEmployeesSignedUpForShift = (s: Shift) => {
    return (
      employeeShifts?.filter((es: EmployeeShift) => es.shiftId == s.id)
        .length ?? 0
    );
  };

  const getEmpShiftCountColor = (s: Shift) => {
    const numSignedUp = getNumEmployeesSignedUpForShift(s);

    const percentageFilled = (numSignedUp / s.requestedEmployees) * 100;
    return percentageFilled <= 20
      ? "text-red-500"
      : percentageFilled <= 80
      ? "text-yellow-600"
      : "text-green-600";
  };

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((shift) => (
            <TableRow key={shift.id} onClick={() => setRowClicked(shift.id)}>
              <TableCell>{shift.location}</TableCell>
              <TableCell>{shift.startTime}</TableCell>
              <TableCell>{shift.endTime}</TableCell>
              <TableCell>{shift.description}</TableCell>
              <TableCell
                className={`flex justify-center font-semibold ${getEmpShiftCountColor(
                  shift
                )}`}
              >
                {isLoading
                  ? "Loading..."
                  : employeeShifts?.filter((es) => es.shiftId == shift.id)
                      .length}{" "}
                / {shift.requestedEmployees}
              </TableCell>
            </TableRow>
          ))}
          {isAdding && <AddShift projectId={projectId} />}
        </TableBody>
      </Table>
      {!isAdding && (
        <Button
          variant="outline"
          size="icon"
          disabled={project?.status === "ARCHIVED"}
          onClick={() => setAddingCount(addingCount + 1)}
        >
          <CirclePlus className="h-16 w-16" />
        </Button>
      )}
      {isAdding && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsAdding(false)}
        >
          <CircleMinus className="h-16 w-16" />
        </Button>
      )}
    </>
  );
}
