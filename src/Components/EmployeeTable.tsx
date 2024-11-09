import { Employee } from "@/Data/Interfaces/EmployeeInterface";
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
        const getRoles = async () => {
            const roles = await getAllRoles();
            setRoles(roles);
        }
        getRoles();
    }, [])

    return (
        <>
            <table>
                <thead>
                    <th>Name</th>
                    <th>Email</th>
                    <th>PhoneNumber</th>
                    <th>Role</th>
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
