export const queryKeys = {
  all: ["shifts", "archivedShifts", "employeeShifts", "employees"],
  shifts: ["shifts"],
  shiftsByUser: (email: string) => {
    return ["shifts", email];
  },
  archivedShifts: ["archivedShifts"],
  employeeShifts: ["employeeShifts"],
  projectShifts: ["projectShifts"],
  employees: ["employees"],
};
