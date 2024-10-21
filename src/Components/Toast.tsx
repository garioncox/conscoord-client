import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useCustomToast = () => {
  const createToast = async (
    asyncFunction: any,
    params: any,
    defaultMessage: string
  ) => {
    console.log(params);
    const response: any = await toast.promise(
      asyncFunction(params), {
      pending: `${defaultMessage}...`,
      success: {
        render() {
          return `${defaultMessage} Successful!`;
        },
      },
      error: {
        render({ data }: { data: any }) {
          return data.message || `Error ${defaultMessage}`;
        },
      },
    });
    console.log( `response was ${response}`);
    return response;
  };

  return {
    createToast,
  };
};
