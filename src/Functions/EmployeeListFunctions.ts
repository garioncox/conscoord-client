import { useState } from "react";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import Role from "../Data/Interfaces/RoleInterface";


export const useGetEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchEmployees = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + "api/Employee/getall");
        const value = await response.json();
        setEmployees(value);
    };

    return { employees, fetchEmployees };

}

export const useGetRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);

    const fetchRoles = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL + "api/Role/getall");
        const value = await response.json();
        setRoles(value);
    };

    return { roles, fetchRoles };
}


export const useGetRoleName = (roles: Role[], roleId: number) => {
    const role = roles ? roles.find((role) => role.id === roleId) : null;
    return role ? role.rolename : ""; // Provide a default name if role is not found
};