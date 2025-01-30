import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import { getCompanies } from "../CompanyRequests";

export const useAllCompanies = () => {
    return useQuery({
      queryKey: queryKeys.companies,
      queryFn: getCompanies,
    });
  };