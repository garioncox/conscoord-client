
// Functions
import { useShiftRequests } from "../../Functions/ShiftRequests";
import { useEmpShiftRequests } from "../../Functions/EmpShiftRequests";
import { useEmailRequests } from "../../Functions/EmailRequests";
import { useEmployeeRequests } from "../../Functions/EmployeeRequests";
import { useProjectRequests } from "../../Functions/ProjectRequests";
import { useProjectShiftRequests } from "../../Functions/ProjectShiftRequests";

// Components
import PermissionLock, { PSO_ROLE } from "../../Components/Auth/PermissionLock";
import { useCustomToast } from "../../Components/Toast";

// Notifications
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Re-export types
export type { Shift } from "../../Data/Interfaces/Shift";
export type { EmailRequest } from "../../Data/Interfaces/Email";
export type { Project } from "../../Data/Interfaces/Project";
export type { ProjectShift } from "../../Data/Interfaces/ProjectShift";
export type { EmployeeShiftDTO } from "../../Data/DTOInterfaces/EmployeeShiftDTO";

// Re-export hooks and components
export { 
  useShiftRequests,
  useEmpShiftRequests,
  useEmailRequests,
  useEmployeeRequests,
  useProjectRequests,
  useProjectShiftRequests,
  PermissionLock,
  PSO_ROLE,
  useCustomToast,
  toast,
};
