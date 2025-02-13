import axios from "axios";
import { Company } from "../Data/Interfaces/Company";

export const getCompanies = async (): Promise<Company[]> => {
  const response = await axios.get(`/api/Company/getAll`);
  return response.data;
};

export const AddCompany = async (token: string, companyName: string) => {
  await axios.post(`/api/Company/add`, { companyName }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};