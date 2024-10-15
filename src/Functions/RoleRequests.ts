import axios from "axios";
import Role from "../Data/Interfaces/RoleInterface";
import { useState } from "react";

export const useRoleRequests = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const getAllRoles = async (): Promise<Role[]> => {
    const response = await axios.get(`/api/Role/getAll`);
    return response.data;
  };

  const getRoleFromEmail = async (email: string): Promise<Role> => {
    const response = await axios.get(`/api/Role/getByEmail/${email}`);
    return response.data;
  };

  const useGetRoleName = (roles: Role[], roleId: number) => {
    const role = roles.find((role) => role.id === roleId);
    return role ? role.rolename : "";
  };

  const setRolesList = async () => {
    setRoles(await getAllRoles());
  };

  return {
    roles,
    getRoleFromEmail,
    getAllRoles,
    useGetRoleName,
    setRolesList,
  };
};