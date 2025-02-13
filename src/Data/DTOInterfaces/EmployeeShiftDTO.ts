export interface EmployeeShiftDTO {
  id: number | null;
  clockInTime?: string;
  clockOutTime?: string;
  didnotwork: boolean;
  empId: number;
  hasbeeninvoiced: boolean;
  notes?: string;
  reportedcanceled: boolean;
  shiftId: number;
}
