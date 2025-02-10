import axios from "axios";
import Role from "../Data/Interfaces/RoleInterface";
import { useState } from "react";

export const useRoleRequests = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const getRoleFromEmail = async (
    email: string,
    id_token: string
  ): Promise<Role> => {
    const response = await axios.get(`/api/Role/getByEmail/${email}`, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });
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
    useGetRoleName,
    setRolesList,
  };
};

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await axios.get(`/api/Role/getAll`);
  return response.data;
};

export const getRoleForLoggedInUser = async (id_token: string): Promise<Role> => {
  const response = await axios.get(`/api/Role/get/currentUser`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });
  return response.data;
};
