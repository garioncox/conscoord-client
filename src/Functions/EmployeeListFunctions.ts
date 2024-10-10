import { useState } from "react";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import Role from "../Data/Interfaces/RoleInterface";
import { getAllEmployees, getAllRoles } from "./ApiRequests";

export const useGetEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    setEmployees(await getAllEmployees());
  };

  return { employees, fetchEmployees };
};

export const useGetRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    setRoles(await getAllRoles());
  };

  return { roles, fetchRoles };
};

export const useGetRoleName = (roles: Role[], roleId: number) => {
  const role = roles.find((role) => role.id === roleId);
  return role ? role.rolename : "";
};