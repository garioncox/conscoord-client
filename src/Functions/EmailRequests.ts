import axios from "axios";
import { EmailRequest } from "../Data/Interfaces/Email";

export const useEmailRequests = () => {
  const sendEmail = async (email: EmailRequest) => {
    try {
      await axios.post(`/api/Email/send/`, email);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 405) {
          console.warn("Error 405: Feature Flag Not Enabled");
        } else {
          console.warn(e);
        }
      } else {
        console.warn("Unexpected error:", e);
      }
    }
  };

  return {
    sendEmail,
  };
};
