export interface EmployeeShiftDTO {
  id: number | null;
  clockInTime?: string;
  clockOutTime?: string;
  didnotwork: boolean;
  empId: number;
  hasbeeninvoiced: boolean;
  reportedcanceled: boolean;
  shiftId: number;
  notes?: string;
}
