import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import { invoiceCreationDTO } from "@/Data/DTOInterfaces/CreateInvoice";
import { useInvoiceRequests } from "../InvoiceRequest";

export const useInvoicePreviewData = (dto: invoiceCreationDTO | null) => {
  const invoiceRequests = useInvoiceRequests();
  
  return useQuery({
    queryKey: queryKeys.invoicePreviewData(dto!),
    queryFn: () => {
      if (dto) {
        return invoiceRequests.getInvoiceInfo(dto);
      }
    },
    enabled: !!dto,
  });
};
