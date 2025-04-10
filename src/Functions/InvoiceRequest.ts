import { AzureInvoiceDTO } from "@/Data/DTOInterfaces/AzureInvoiceDTO";
import { invoiceCreationDTO } from "@/Data/DTOInterfaces/CreateInvoice";
import { InvoiceInfoDTO } from "@/Data/DTOInterfaces/InvoiceInfoDTO";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { toast } from "react-toastify";
import { queryClient } from "./Queries/QueryClient";
import { queryKeys } from "./Queries/QueryKeyFactory";

export const useInvoiceRequests = () => {
  const { user } = useAuth();

  const getInvoiceInfo = async (
    dto: invoiceCreationDTO
  ): Promise<InvoiceInfoDTO[]> => {
    const response = await axios.post(`/api/Invoice/getInvoicePreview`, dto, {
      headers: {
        Authorization: `Bearer ${user?.id_token ?? ""}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const useAllInvoicesForCompany = async (
    companyId: number | undefined
  ): Promise<AzureInvoiceDTO[]> => {
    const response = await axios.get(`/api/Invoice/getAll/${companyId}`, {
      headers: {
        Authorization: `Bearer ${user?.id_token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  return {
    getInvoiceInfo,
    useAllInvoicesForCompany,
  };
};

export const createInvoice = async (
  id_token: string,
  dto: invoiceCreationDTO
) => {
  try {
    const response = await axios.post(`/api/Invoice/generateInvoice`, dto, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${id_token}`,
        "Content-Type": "application/json",
      },
    });
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    window.open(url);

    toast.success("Success Creating Invoice");
    queryClient.invalidateQueries({
      queryKey: [queryKeys.allInvoices, dto.companyId],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const text = await error.response.data.text();
    toast.error(text);
  }
};
