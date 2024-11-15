import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import { getAllEmployeeShifts } from "../EmpShiftRequests";

export const useAllEmployeeShifts = () => {  
    return useQuery({
      queryKey: queryKeys.employeeShifts,
      queryFn: getAllEmployeeShifts
    });
  };