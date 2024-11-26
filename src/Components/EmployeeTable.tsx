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
import { useState } from "react";

interface TableComponentProps {
  data: Employee[];
}

export function EmployeeTable({ data }: TableComponentProps) {
  const { data: roles } = useAllRoles();
  const [sortValue, setSortValue] = useState<string>("");

  const sortMethods: { [key: string]: (a: Employee, b: Employee) => number } = {
    Name: (a, b) => a.name.localeCompare(b.name),
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
      <label className="mr-3">Sort By</label>
      <select
        className="text-black"
        onChange={(e) => {
          setSortValue(e.target.value);
        }}
      >
        <option value="" selected disabled>Choose a value</option>
        <option value="Name">Name</option>
      </select>
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>PhoneNumber</TableHead>
          <TableHead>Role</TableHead>
        </TableHeader>
        <TableBody>
          {SortData().map((employee) => (
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
