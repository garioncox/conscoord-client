export interface EmployeeShiftDTO {
  id: number | null;
  clockInTime?: string | null;
  clockOutTime?: string | null;
  didNotWork: boolean;
  empId: number;
  hasbeeninvoiced: boolean;
  notes?: string;
  reportedCanceled: boolean;
  shiftId: number;
}
