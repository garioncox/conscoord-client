import axios from "axios";
import { Company } from "../Data/Interfaces/Company";

export const getCompanies = async (): Promise<Company[]> => {
  const response = await axios.get(`/api/Company/getAll`);
  return response.data;
};

export const AddCompany = async (
  token: string,
  companyName: string
): Promise<number> => {
  const response = await axios.post(
    `/api/Company/add`,
    { companyName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getCompanyNameByProjectId = async (
  id_token: string,
  projectId: number
) => {
  const response = await axios.get(`/api/Company/get/name/${projectId}`, {
    headers: {
      Authorization: `Bearer ${id_token ?? ""}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
