import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { CircleMinus, CirclePlus, Table } from "lucide-react";
import { AddShift } from "./AddShift";
import { Button } from "./ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { useRoleRequests } from "@/Functions/RoleRequests";
import { useEffect, useState } from "react";
import Role from "@/Data/Interfaces/RoleInterface";

interface TableComponentProps {
    data: Employee[];
    setRowClicked: (id: number) => void;
}

export function EmployeeTable({
    data,
    setRowClicked,
}: TableComponentProps) {
    const { getAllRoles } = useRoleRequests();
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        populateRoles()
    })

    async function populateRoles() {
        const roles = await getAllRoles();
        setRoles(roles);
    }


    return (
        <>
        
            <table className="table-auto">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>PhoneNumber</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((employee) => (
                        <tr key={employee.id} onClick={() => setRowClicked(employee.id)}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phonenumber}</td>
                            <td>{roles.find((role) => role.id === employee.roleid)?.rolename}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
        </>
    )
}
