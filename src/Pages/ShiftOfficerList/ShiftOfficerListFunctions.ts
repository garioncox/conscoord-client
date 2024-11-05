import { useCustomToast } from "@/Components/Toast";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { FulfilledShifts } from "@/Data/Interfaces/FulfilledShift";
import { Project } from "@/Data/Interfaces/Project";
import ProjectShift from "@/Data/Interfaces/ProjectShift";
import { Shift } from "@/Data/Interfaces/Shift";
import { useEmailRequests } from "@/Functions/EmailRequests";
import { useEmployeeRequests } from "@/Functions/EmployeeRequests";
import { useEmpShiftRequests } from "@/Functions/EmpShiftRequests";
import { useProjectRequests } from "@/Functions/ProjectRequests";
import { useProjectShiftRequests } from "@/Functions/ProjectShiftRequests";
import { useShiftRequests } from "@/Functions/ShiftRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { toast } from "react-toastify";


export const useShiftOfficerListFunctions = () => {
    const { addEmployeeShift, getSignedUpShifts, getAllEmployeeShifts } =
    useEmpShiftRequests();
  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getAllShifts } = useShiftRequests();
  const { getAllProjects } = useProjectRequests();
  const { getAllProjectShifts } = useProjectShiftRequests();
  const { sendEmail } = useEmailRequests();
  const { createToast } = useCustomToast();
  const { user } = useAuth0();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectShifts, setProjectShifts] = useState<ProjectShift[]>([]);
  const [fulfilledShifts, setFulfilledShifts] = useState<FulfilledShifts>({});
  

    async function populateShifts() {
        if (user && user.email !== undefined) {
          const claimed = await getSignedUpShifts(user.email);
          const allShifts = await getAllShifts();
    
          const availableShifts = allShifts.filter(
            (shift) => !claimed.some((claimedShift) => claimedShift.id === shift.id)
          );
    
          setShifts(availableShifts);
        }
      }
    
      async function populateProjects() {
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);
      }
    
      async function populateProjectShifts() {
        const fetchedProjectShifts = await getAllProjectShifts();
        setProjectShifts(fetchedProjectShifts);
      }
    
      async function getFulfilledShifts(id: number): Promise<number> {
        const allTakenShifts = (await getAllEmployeeShifts()).filter(
          (es) => es.shiftId === id
        );
        return allTakenShifts.length;
      }
    
      async function takeShift(s: Shift) {
        const allTakenShifts = (await getAllEmployeeShifts()).filter(
          (es) => es.shiftId === s.id
        );
        if (allTakenShifts.length >= s.requestedEmployees) {
          toast.error("Sorry, Maximum number of officers reached");
        } else if (user && user.email) {
          const currUser = await getEmployeeByEmail(user.email);
          const employee: EmployeeShiftDTO = {
            EmployeeId: currUser.id,
            ShiftId: s.id,
          };
          await createToast(addEmployeeShift, employee, "Signing up for shift...");
    
          setShifts(shifts.filter((shift) => shift.id !== s.id));
        }
      }

      return {
        populateShifts,
        populateProjects,
        populateProjectShifts,
        getFulfilledShifts,
        takeShift,
        shifts,
        setFulfilledShifts,
        projects,
        projectShifts,
        fulfilledShifts,
        sendEmail
      }
}