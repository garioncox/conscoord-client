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
  import React from "react";
import { AddProject } from "./AddProject";
import { Project } from "@/Data/Interfaces/Project";
  
  interface TableComponentProps {
    data: Project[];
    setRowClicked: (id: number) => void;
  }
  
  export function ProjectTable({
    data,
    setRowClicked,
  }: TableComponentProps) {
  
    const [addingCount, setAddingCount] = React.useState(0);
  
    return (
      <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((project) => (
            <TableRow key={project.id} onClick={() => setRowClicked(project.id)}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.startDate}</TableCell>
                <TableCell>{project.endDate}</TableCell>
                <TableCell>{project.status}</TableCell>
            </TableRow>
              ))}
        </TableBody>
      </Table>
      {addingCount > 0 && <AddProject />}
  
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
  