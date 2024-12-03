import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { AddShift } from "../AddShift";
import { Button } from "../ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { Shift } from "@/Data/Interfaces/Shift";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";
import ShiftSort from "../Sorting/ShiftSort";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { combineDates, combineTimes } from "@/Functions/CombineTime";

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
  const { data: employeeShifts, isLoading: employeeShiftsLoading } =
    useAllEmployeeShifts();
  const [sortedData, setSortedData] = useState<Shift[]>(data);
  const [isAdding, setIsAdding] = useState<boolean>(false);

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

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  return (
    <>
      <ShiftSort data={data} onSortChange={setSortedData} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Shift Times</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Requested Employees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((shift) => (
            <TableRow key={shift.id} onClick={() => setRowClicked(shift.id)}>
              <TableCell>{shift.location}</TableCell>
              <TableCell>{new Date(shift.startTime).toLocaleDateString()}</TableCell>
              <TableCell>{combineTimes(shift.startTime,shift.endTime)}</TableCell>
              <TableCell>{shift.description}</TableCell>
              <TableCell
                className={`flex justify-center font-semibold ${getEmpShiftCountColor(
                  shift
                )}`}
              >
                {employeeShiftsLoading
                  ? "Loading..."
                  : employeeShifts?.filter((es) => es.shiftId == shift.id)
                      .length}{" "}
                / {shift.requestedEmployees}
              </TableCell>
            </TableRow>
          ))}
          {isAdding === true && <AddShift projectId={projectId} />}
        </TableBody>
      </Table>

      {isAdding === false && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsAdding(true)}
        >
          <CirclePlus className="h-16 w-16" />
        </Button>
      )}
      {isAdding === true && (
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
