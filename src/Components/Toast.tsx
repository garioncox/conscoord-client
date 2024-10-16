import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useCustomToast = () => {
    const createToast = (
        asyncFunction: any,
        params: any,
        defaultMessage: string
    ) => {
        toast.promise(asyncFunction(params), {
            pending: `${defaultMessage}`,
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
    };

    return {
        createToast,
    };
};
