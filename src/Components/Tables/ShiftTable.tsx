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
import ShiftSort from "../Sorting/ShiftSort";
import { useShiftsFulfilledUtils } from "../ShiftsFulfilledHook";

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
  const { shiftFractionString, shiftFractionStyles } =
    useShiftsFulfilledUtils();
  const [sortedData, setSortedData] = useState<Shift[]>(data);
  const [isAdding, setIsAdding] = useState<boolean>(false);

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
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Requested Employees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((shift) => (
            <TableRow key={shift.id} onClick={() => setRowClicked(shift.id)}>
              <TableCell>{shift.location}</TableCell>
              <TableCell>{shift.startTime}</TableCell>
              <TableCell>{shift.endTime}</TableCell>
              <TableCell>{shift.description}</TableCell>
              <TableCell
                className={`flex justify-center font-semibold ${shiftFractionStyles(
                  shift
                )}`}
              >
                {shiftFractionString(shift)}
              </TableCell>
            </TableRow>
          ))}
          {isAdding === true && <AddShift projectId={projectId} />}
        </TableBody>
      </Table>

      {isAdding === false && (
        <Button variant="outline" size="icon" onClick={() => setIsAdding(true)}>
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
