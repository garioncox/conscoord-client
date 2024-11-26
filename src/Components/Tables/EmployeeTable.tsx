import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { useAllRoles } from "@/Functions/Queries/RoleQueries";
import { useEffect, useState } from "react";
import EmployeeSort from "../Sorting/EmployeeSort";

interface TableComponentProps {
  data: Employee[];
}

export function EmployeeTable({ data }: TableComponentProps) {
  const { data: roles } = useAllRoles();
  const [sortedData, setSortedData] = useState<Employee[]>(data);
  
  useEffect(() => {
    if (data) {
      setSortedData(data); 
    }
  }, [data]);

  return (
    <>
      <EmployeeSort data={data} onSortChange={setSortedData} />
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>PhoneNumber</TableHead>
          <TableHead>Role</TableHead>
        </TableHeader>
        <TableBody>
          {sortedData.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phonenumber}</TableCell>
              <TableCell>
                {roles
                  ? roles.find((role) => role.id === employee.roleid)
                      ?.rolename || "No Role Found"
                  : "Loading Roles"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
