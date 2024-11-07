import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ChevronLeft, ChevronRight, CircleMinus, CirclePlus } from "lucide-react";
=======

import { CircleMinus, CirclePlus } from "lucide-react";
import { SetStateAction } from "react";
import { Pagination } from "./Pagination";
>>>>>>> c3c41e5db88a9024cb31140b9f1334f6e197f6cf

interface PaginatedProjectTableProps {
  data: any[];
  tableHeaders: string[];
  rows: (keyof any)[];
  children?: React.ReactNode;
  setRowClicked: (id: number) => void
}

export function PaginatedTable({
  data,
  tableHeaders,
  rows,
  children,
  setRowClicked,
}: PaginatedProjectTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [addingCount, setAddingCount] = React.useState(0);

  return (
    <div className="space-y-4 shadow-xl p-10 rounded-xl bg-tertiary">
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((project) => (
            <TableRow key={project.id} onClick={() => setRowClicked(project.id)}>
              {rows.map((row) => (
                <TableCell>{project[row]}</TableCell>
              ))}
            </TableRow>
          ))}
          {addingCount > 0 && children}
        </TableBody>
      </Table>

      {addingCount === 0 &&
        <Button
          variant="outline"
          size="icon"
          onClick={() => setAddingCount(addingCount + 1)}>
          <CirclePlus className="h-16 w-16" />
        </Button>}
      {addingCount >= 1 &&
        <Button variant="outline" size="icon" onClick={() => setAddingCount(addingCount - 1)}>
          <CircleMinus className="h-16 w-16" />
        </Button>}
        
      <Pagination setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} datalength={data.length} itemsPerPage={itemsPerPage} currentPage={currentPage} />
    </div>
  );
}
