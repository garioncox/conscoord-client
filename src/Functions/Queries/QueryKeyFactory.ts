export const queryKeys = {
  all: ["shifts"],

  shifts: ["shifts"],
  shiftById: (id: number) => {
    return ["shifts", id];
  },
  shiftByUser: (email: string) => {
    return ["shifts", email];
  },

  archivedShifts: ["archivedShifts"],
  archivedShiftById: (id: number) => {
    return ["archivedShifts", id];
  },

  employeeShifts: ["employeeShifts"],
  employeeShiftById: (id: number) => {
    return ["employeeShifts", id];
  },

  employees: ["employees"],
  employeeByEmail: (email: string) => {
    return ["employees", email];
  },
};
