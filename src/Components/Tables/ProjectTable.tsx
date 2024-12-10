import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddProject } from "../AddProject";
import { Project } from "@/Data/Interfaces/Project";
import { combineDates } from "@/Functions/CombineTime";

interface TableComponentProps {
  data: Project[];
  setRowClicked: (id: number) => void;
}

export function ProjectTable({ data, setRowClicked }: TableComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortedData, setSortedData] = useState<Project[]>(data);

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
      {isModalOpen && (
        <AddProject toggleModal={toggleModal} isModalOpen={isModalOpen} />
      )}

      <Button variant="outline" size="icon" onClick={() => toggleModal()}>
        <CirclePlus className="h-16 w-16" />
      </Button>
    </>
  );
}
