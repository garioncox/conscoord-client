import { useEffect } from "react";
import * as Imports from './ShiftOfficerListImports'
import useCustomVariables from "./ShiftOfficerListVariables";

const useCustomFunctions = () => {
    const Variables = useCustomVariables();

    useEffect(() => {
        populateShifts();
        populateProjects();
        populateProjectShifts();
      }, [Variables.user?.email]);
    
      useEffect(() => {
        const fetchFulfilledShifts = async () => {
          const results = await Promise.all(
            Variables.shifts.map((s) => getFulfilledShifts(s.id))
          );
          const fulfilledMap: Record<string, number | null> = {};
          Variables.shifts.forEach((shift, index) => {
            fulfilledMap[shift.id] = results[index];
          });
          Variables.setFulfilledShifts(fulfilledMap);
        };
    
        fetchFulfilledShifts();
      }, [Variables.shifts]);

      async function populateShifts() {
        if (Variables.user && Variables.user.email !== undefined) {
          const claimed = await Variables.getSignedUpShifts(Variables.user.email);
          const allShifts = await Variables.getAllShifts();
    
          const availableShifts = allShifts.filter(
            (shift) => !claimed.some((claimedShift) => claimedShift.id === shift.id)
          );
    
          Variables.setShifts(availableShifts);
        }
      }
    
      async function populateProjects() {
        Variables.setProjects(await Variables.getAllProjects());
      }
    
      async function populateProjectShifts() {
        Variables.setProjectShifts(await Variables.getAllProjectShifts());
      }
    
      async function getFulfilledShifts(id: number) {
        const allTakenShifts = (await Variables.getAllEmployeeShifts()).filter(
          (es) => es.shiftId == id
        );
        return allTakenShifts.length;
      }
    
      async function takeShift(s: Imports.Shift) {
        const allTakenShifts = (await Variables.getAllEmployeeShifts()).filter(
          (es) => es.shiftId == s.id
        );
        if (allTakenShifts.length >= s.requestedEmployees) {
          Imports.toast.error("Sorry, Maximum number of officers reached");
        } else if (Variables.user && Variables.user.email) {
          const currUser = await Variables.getEmployeeByEmail(Variables.user.email);
          const employee: Imports.EmployeeShiftDTO = {
            EmployeeId: currUser.id,
            ShiftId: s.id,
          };
          await Variables.createToast(Variables.addEmployeeShift, employee, "Signing up for shift...");
    
          Variables.setShifts(Variables.shifts?.filter((shift) => shift.id !== s.id));
        }
      }
    
    return {
        populateShifts,
        populateProjects,
        populateProjectShifts,
        getFulfilledShifts,
        takeShift,
    }
};

export default useCustomFunctions;