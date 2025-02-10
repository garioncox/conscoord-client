import { InvoiceInfoDTO } from "@/Data/DTOInterfaces/InvoiceInfoDTO";
import axios from "axios";
import { toast } from "react-toastify";


export const getInvoiceInfo = async (): Promise<InvoiceInfoDTO[]> => {
    const response = await axios.get(`/api/Invoice`);
    return response.data;
  };

export const createInvoice = async () => {
    try {
        const response = await axios.get(`/api/Invoice/generateInvoice`, {
            responseType: 'blob', 
        });
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        toast.success("Success Creating Invoice")
    }
    catch {
        console.error("Failed to generate Invoice");
        toast.error("Error Creating Invoice")
    }
  };