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

interface TableComponentProps {
  data: Project[];
  setRowClicked: (id: number) => void;
}

export function EmployeeProjectTable({
  data,
  setRowClicked,

}: TableComponentProps) {
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
          {data.map((project) => {
            if (project.status === "ARCHIVED") {
              return (
                <TableRow key={project.id}>
                  <TableCell className="text-slate-200">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-slate-200">
                    {project.location}
                  </TableCell>
                  <TableCell className="text-slate-200">
                    {combineDates(project.startDate, project.endDate)}
                  </TableCell>
                  <TableCell className="text-slate-200">
                    {project.status}
                  </TableCell>
                </TableRow>
              );
            } else {
              return (
                <TableRow
                  key={project.id}
                  onClick={() => setRowClicked(project.id)}
                >
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{combineDates(project.startDate, project.endDate)}</TableCell>
                  <TableCell>{project.status}</TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </>
  );
}
