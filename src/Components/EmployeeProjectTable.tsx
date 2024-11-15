import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Project } from "@/Data/Interfaces/Project";

interface TableComponentProps {
  data: Project[];
  setRowClicked: (id: number) => void;
  archived: boolean;
  setArchived: (archived: boolean) => void;
}

export function EmployeeProjectTable({
  data,
  setRowClicked,
  archived,
  setArchived,
}: TableComponentProps) {
  return (
    <>
      <div className="flex grow justify-end">
        <label>
          Show Archived Projects
          <input
            checked={!archived}
            onChange={() => setArchived(!archived)}
            type="checkbox"
            className="w-5 h-5 border-2 border-gray-400 rounded-sm checked:border-transparent cursor-pointer ms-5"
          />
        </label>
      </div>
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
                    {project.startDate}
                  </TableCell>
                  <TableCell className="text-slate-200">
                    {project.endDate}
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
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
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
