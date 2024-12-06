export const queryKeys = {
  all: ["shifts", "archivedShifts", "employeeShifts", "loggedInEmployees"],
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
  loggedInEmployees: ["loggedInEmployees"],
  employees: ["employees"],
  roles: ["roles"],
  employeeId: ["employeeId"],
  companyProjects: ["companyProjects"],
  employeesByShift: (shiftId: number) => {
    return ["employeesByShift", shiftId];
  },
  archivedProjects: ["archivedProjects"],
  projects: ["allProjects"],
};
