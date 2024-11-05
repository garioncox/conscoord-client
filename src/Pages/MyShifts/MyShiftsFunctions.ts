import { Shift } from "@/Data/Interfaces/Shift";
import { useEmpShiftRequests } from "@/Functions/EmpShiftRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export const useMyShiftFunctions = () => {
  const EmpShiftFunctions = useEmpShiftRequests();
  const { user } = useAuth0();

  const [claimedShifts, setClaimedShifts] = useState<Shift[]>([]);

  async function populateShifts() {
    if (user && user.email !== undefined) {
      setClaimedShifts(await EmpShiftFunctions.getSignedUpShifts(user.email));
    }
  }

  return {
    populateShifts,
    claimedShifts,
  };
};
