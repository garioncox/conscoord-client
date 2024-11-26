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
import { useState } from "react";

interface TableComponentProps {
  data: Project[];
  setRowClicked: (id: number) => void;
}

export function EmployeeProjectTable({
  data,
  setRowClicked,
}: TableComponentProps) {
  const [sortValue, setSortValue] = useState<string>("");

  const sortMethods: { [key: string]: (a: Project, b: Project) => number } = {
    startDateAsc: (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    startDateDesc: (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    endDateAsc: (a, b) =>
      new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    endDateDesc: (a, b) =>
      new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
    Name: (a, b) => a.name.localeCompare(b.name),
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
        <option value="" selected disabled>
          Choose A Sort Value
        </option>
        <option value="Name">Name</option>
        <option value="Location">Location</option>
        <option value="startDateAsc">Soonest First</option>
        <option value="startDateDesc">Latest First</option>
        <option value="endDateAsc">Soonest End Date First</option>
        <option value="endDateDesc">Latest End Date First</option>
      </select>
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
          {SortData().map((project) => {
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
