export interface EmployeeShiftDTO {
  id: number | null;
  clockInTime?: string | null;
  clockOutTime?: string | null;
  didnotwork: boolean;
  empId: number;
  hasbeeninvoiced: boolean;
  notes?: string;
  reportedcanceled: boolean;
  shiftId: number;
}
