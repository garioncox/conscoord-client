export const queryKeys = {
  all: ["shifts", "archivedShifts", "employeeShifts", "loggedInEmployees"],
  shifts: ["shifts"],
  shiftsByUser: (email: string) => {
    return ["shifts", email];
  },
  archivedShifts: ["archivedShifts"],
  employeeShifts: ["employeeShifts"],
  allEmployeeShifts: ["allEmployeeShifts"],
  projectShifts: ["projectShifts"],
  loggedInEmployees: ["loggedInEmployees"],
  employees: ["employees"],
  roles: ["roles"],
  employeesByShift: (shiftId: number) => {
    return ["employeesByShift", shiftId];
  },
};
