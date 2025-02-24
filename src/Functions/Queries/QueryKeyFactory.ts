import { invoiceCreationDTO } from "@/Data/DTOInterfaces/CreateInvoice";

export const queryKeys = {
  all: [
    "shifts",
    "employeeByEmail",
    "archivedShifts",
    "employeeShifts",
    "allEmployeeShifts",
    "numProjectShifts",
    "shiftsByProject",
    "loggedInEmployee",
    "employees",
    "roles",
    "employeeId",
    "companyProjects",
    "employeesByShift",
    "archivedProjects",
    "allProjects",
    "allCompanies",
    "employeeHistory"
  ],
  shifts: ["shifts"],
  shiftsByUser: (email: string) => {
    return ["shifts", "email", email];
  },
  shiftsById: (id: number) => {
    return ["shifts", "id", id];
  },
  employeeByEmail: ["employeeByEmail"],
  archivedShifts: ["archivedShifts"],
  employeeShifts: ["employeeShifts"],
  allEmployeeShifts: ["allEmployeeShifts"],
  numProjectShifts: ["numProjectShifts"],
  shiftsByProject: ["shiftsByProject"],
  projectShifts: ["projectShifts"],
  loggedInEmployee: ["loggedInEmployee"],
  employees: ["employees"],
  roles: ["roles"],
  employeeId: ["employeeId"],
  companyProjects: ["companyProjects"],
  employeesByShift: (shiftId: number) => {
    return ["employeesByShift", shiftId];
  },
  archivedProjects: ["archivedProjects"],
  projects: ["allProjects"],
  companies: ["allCompanies"],
  employeeHistory: ["employeeHistory"],
  invoicePreviewData: (dto: invoiceCreationDTO) => {return ["invoicePreview", dto]},
  shiftErrorDates: ["shiftErrorDates"]
};
