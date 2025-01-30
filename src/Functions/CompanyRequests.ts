import axios from "axios";
import { Company } from "../Data/Interfaces/Company";

export const getCompanies = async (): Promise<Company[]> => {
  const response = await axios.get(`/api/Company/getAll`);
  return response.data;
};