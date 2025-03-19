import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import {
  AddCompany,
  getCompanies,
  getCompanyNameByProjectId,
} from "../CompanyRequests";
import { useAuth } from "react-oidc-context";
import { queryClient } from "./QueryClient";
import { useCustomToast } from "@/Components/Toast";

export const useAllCompanies = () => {
  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: getCompanies,
  });
};

export const useCompanyNameByProjectId = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.companies, id],
    queryFn: async () => await getCompanyNameByProjectId(id),
  });
};

export const useAddCompanyMutation = () => {
  const { user } = useAuth();
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async ({ companyName }: { companyName: string }) => {
      return await createToast(
        AddCompany,
        "Adding Company",
        user?.id_token ?? "",
        companyName
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies });
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees });
    },
  });
};
