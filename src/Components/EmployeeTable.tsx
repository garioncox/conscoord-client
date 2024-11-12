import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { useRoleRequests } from "@/Functions/RoleRequests";
import { useEffect, useState } from "react";
import Role from "@/Data/Interfaces/RoleInterface";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/Components/ui/table";

interface TableComponentProps {
    data: Employee[];
}

export function EmployeeTable({
    data,
}: TableComponentProps) {
    const { getAllRoles } = useRoleRequests();
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const getRoles = async () => {
            const roles = await getAllRoles();
            setRoles(roles);
        }
        getRoles();
    }, [])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>PhoneNumber</TableHead>
                    <TableHead>Role</TableHead>
                </TableHeader>
                <TableBody>
                    {data.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.phonenumber}</TableCell>
                            <TableCell>{roles.find((role) => role.id === employee.roleid)?.rolename}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
