import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useCustomToast = () => {
    const createToast = (asyncFunction: any, params: any) => {
        console.log(params)
        toast.promise(asyncFunction(params), {
            pending: "Action Pending",
            success: {
                render() {
                    return "Action Performed Successfully!";
                },
            },
            error: {
                render({ data }: { data: any }) {
                    return data.message || "Error Performing Action";
                },
            },
        });
    };

    return {
        createToast,
    };
};
