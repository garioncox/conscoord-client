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
        </>
    );
}
