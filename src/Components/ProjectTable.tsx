import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "./ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";
import React, { useState } from "react";
import { AddProject } from "./AddProject";
import { Project } from "@/Data/Interfaces/Project";
import { combineDates } from "@/Functions/CombineTime";

interface TableComponentProps {
  data: Project[];
  setRowClicked: (id: number) => void;
}

export function ProjectTable({ data, setRowClicked }: TableComponentProps) {
  const [addingCount, setAddingCount] = useState(0);
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
      <label>Sort By</label>
      <select
        className="text-black"
        onChange={(e) => {
          setSortValue(e.target.value);
        }}
      >
        <option value="Name">Name</option>
        <option value="Location">Location</option>
        <option value="startDateAsc">Start Date Ascending</option>
        <option value="startDateDesc">Start Date Descending</option>
        <option value="endDateAsc">End Date Ascending</option>
        <option value="endDateDesc">End Date Descending</option>
      </select>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Start Time</TableHead>
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
          {addingCount > 0 && <AddProject />}
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
