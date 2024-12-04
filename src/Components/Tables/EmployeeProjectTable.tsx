import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Project } from "@/Data/Interfaces/Project";
import { combineDates } from "@/Functions/CombineTime";
import { useEffect, useState } from "react";

interface TableComponentProps {
  data: Project[];
  setRowClicked: (id: number) => void;
}

export function EmployeeProjectTable({
  data,
  setRowClicked,
}: TableComponentProps) {
  const [sortedData, setSortedData] = useState<Project[]>(data);

  useEffect(() => {
    if (data) {
      setSortedData(data); 
    }
  }, [data]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((project) => {
            if (project.status === "ARCHIVED") {
              return (
                <TableRow
                  key={project.id}
                  className="text-slate-600 bg-slate-200 border-l-4 "
                >
                  <TableCell className="border-l-4 border-red-400 pl-2">
                    {project.name}
                  </TableCell>
                  <TableCell className="p-2">{project.location}</TableCell>
                  <TableCell className="p-2">
                    {combineDates(project.startDate, project.endDate)}
                  </TableCell>
                  <TableCell className="p-2">{project.status}</TableCell>
                </TableRow>
              );
            } else {
              return (
                <TableRow
                  key={project.id}
                  onClick={() => setRowClicked(project.id)}
                  className="hover:bg-slate-200 py-4"
                >
                  <TableCell className="p-2">{project.name}</TableCell>
                  <TableCell className="p-2">{project.location}</TableCell>
                  <TableCell className="p-2">
                    {combineDates(project.startDate, project.endDate)}
                  </TableCell>
                  <TableCell className="p-2">{project.status}</TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </>
  );
}
