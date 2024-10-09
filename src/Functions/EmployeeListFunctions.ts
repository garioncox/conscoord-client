import { useState } from "react";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import Role from "../Data/Interfaces/RoleInterface";

export const useGetEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    const response = await fetch("/api/Employee/getall");
    const value = await response.json();
    setEmployees(value);
  };

  return { employees, fetchEmployees };
};

export const useGetRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    const response = await fetch("/api/Role/getall");
    const value = await response.json();
    setRoles(value);
  };

  return { roles, fetchRoles };
};

export const useGetRoleName = (roles: Role[], roleId: number) => {
  const role = roles.find((role) => role.id === roleId);
  return role ? role.rolename : "";
};
