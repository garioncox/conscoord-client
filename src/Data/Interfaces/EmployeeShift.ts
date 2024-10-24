export interface EmployeeShift {
  id: number;
  startTime: string;
  endTime: string;
  empId: number;
  shiftId: number;

  // Employee : { Emp } //fill out if needed? it's in the server/db object, not sure if we would need it here yet or not
  // Shift : { Shift } // fill out if needed?
}
