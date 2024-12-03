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
import dayjs from "dayjs";
import Modal from "../Modal";

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

  function formatShiftDuration(startTime: string, endTime: string) {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const hours = end.diff(start, "hour");
    const minutes = end.diff(start, "minute") % 60;

    return `${hours}h ${minutes}m`;
  }

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
            <TableRow
              key={shift.id}
              onClick={() => setRowClicked(shift.id)}
              className="cursor-pointer hover:bg-slate-200"
            >
              <TableCell className="ps-3">{shift.location}</TableCell>
              <TableCell>
                {new Date(shift.startTime).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {dayjs(shift.startTime).format("HH:mm")}-
                {dayjs(shift.endTime).format("HH:mm")}{" "}
                <span className="font-semibold">
                  ({formatShiftDuration(shift.startTime, shift.endTime)})
                </span>
              </TableCell>
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
          <Modal isOpen={isAdding} onClose={() => setIsAdding(!isAdding)}>
            <AddShift projectId={projectId} />
          </Modal>
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
