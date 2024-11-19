export const queryKeys = {
  all: ["shifts", "archivedShifts", "employeeShifts", "loggedInEmployees"],
  shifts: ["shifts"],
  shiftsByUser: (email: string) => {
    return ["shifts", email];
  },
  archivedShifts: ["archivedShifts"],
  employeeShifts: ["employeeShifts"],
  projectShifts: ["projectShifts"],
  loggedInEmployees: ["loggedInEmployees"],
  employees: ["employees"],
  roles: ["roles"],
};
