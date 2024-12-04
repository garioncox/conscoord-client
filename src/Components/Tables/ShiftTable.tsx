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
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Shift } from "@/Data/Interfaces/Shift";
import ShiftSort from "../Sorting/ShiftSort";
import { combineTimes } from "@/Functions/CombineTime";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
              <TableCell>
                {new Date(shift.startTime).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {combineTimes(shift.startTime, shift.endTime)}
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
          {isModalOpen === true && (
            <AddShift
              projectId={projectId}
              toggleModal={toggleModal}
              isModalOpen={isModalOpen}
            />
          )}
        </TableBody>
      </Table>

      <Button variant="outline" size="icon" onClick={() => toggleModal()}>
        <CirclePlus className="h-16 w-16" />
      </Button>
    </>
  );
}
