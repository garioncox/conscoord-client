/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useCustomToast = () => {
  const createToast = async (
    asyncFunction: (...args: any[]) => Promise<any>,
    defaultMessage: string,
    ...params: any[]
  ) => {
    const response: any = await toast.promise(
      async () => {
        return await asyncFunction(...params);
      },
      {
        pending: `${defaultMessage}`,
        success: {
          render() {
            return `${defaultMessage} Successful!`;
          },
        },
        error: {
          render({ data }: { data: any }) {
            if (data?.response) {
              // If the error comes from an HTTP response (e.g., Fetch/Axios)
              return data.response.data || `Error ${defaultMessage}`;
            }
            return data?.message || `Error ${defaultMessage}`;
          },
        },
      }
    );
    return response;
  };

  return {
    createToast,
  };
};
