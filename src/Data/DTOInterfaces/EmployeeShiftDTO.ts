export interface EmployeeShiftDTO {
  id: number | null;
  clockInTime: string;
  clockOutTime: string;
  employeeId: number;
  shiftId: number;
}
