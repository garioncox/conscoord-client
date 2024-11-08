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
import React from "react";
import { Shift } from "@/Data/Interfaces/Shift";

interface TableComponentProps {
  data: Shift[];
  setRowClicked: (id: number) => void;
}

export function ShiftTable({
  data,
  setRowClicked,
}: TableComponentProps) {

  const [addingCount, setAddingCount] = React.useState(0);

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
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((shift) => (
          <TableRow key={shift.id} onClick={() => setRowClicked(shift.id)}>
              <TableCell>{shift.location}</TableCell>
              <TableCell>{shift.startTime}</TableCell>
              <TableCell>{shift.endTime}</TableCell>
              <TableCell>{shift.description}</TableCell>
              <TableCell>{shift.requestedEmployees}</TableCell>
              <TableCell>{shift.status}</TableCell>
              
          </TableRow>
            ))}
      </TableBody>
    </Table>
    {addingCount > 0 && <AddShift />}

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
