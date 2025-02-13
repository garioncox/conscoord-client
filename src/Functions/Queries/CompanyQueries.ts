import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import { AddCompany, getCompanies } from "../CompanyRequests";
import { useAuth } from "react-oidc-context";
import { toast } from "react-toastify";
import { queryClient } from "./QueryClient";

export const useAllCompanies = () => {
  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: getCompanies,
  });
};

export const useAddProjectMutation = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ companyName }: { companyName: string }) => {
      AddCompany(user?.id_token ?? "", companyName);
    },
    onSuccess: () => {
      toast.success("Company created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.companies });
    },
  });
};