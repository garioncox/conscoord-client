import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import * as Imports from "./ShiftOfficerListImports"; // Adjust the path to your imports file

const useCustomVariables = () => {
  // Extract functions from Imports
  const { addEmployeeShift, getSignedUpShifts, getAllEmployeeShifts } = Imports.useEmpShiftRequests();
  const { getEmployeeByEmail } = Imports.useEmployeeRequests();
  const { getAllShifts } = Imports.useShiftRequests();
  const { getAllProjects } = Imports.useProjectRequests();
  const { getAllProjectShifts } = Imports.useProjectShiftRequests();
  const { sendEmail } = Imports.useEmailRequests();
  const { createToast } = Imports.useCustomToast();
  const { user } = useAuth0();

  // Define state variables
  const [shifts, setShifts] = useState<Imports.Shift[]>([]);
  const [projects, setProjects] = useState<Imports.Project[]>([]);
  const [projectShifts, setProjectShifts] = useState<Imports.ProjectShift[]>([]);
  const [fulfilledShifts, setFulfilledShifts] = useState({});

  // Return everything you need
  return {
    addEmployeeShift,
    getSignedUpShifts,
    getAllEmployeeShifts,
    getEmployeeByEmail,
    getAllShifts,
    getAllProjects,
    getAllProjectShifts,
    sendEmail,
    createToast,
    user,
    shifts,
    setShifts,
    projects,
    setProjects,
    projectShifts,
    setProjectShifts,
    fulfilledShifts,
    setFulfilledShifts,
  };
};

export default useCustomVariables;
