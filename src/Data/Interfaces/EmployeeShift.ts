export interface EmployeeShift {
  id: number;
  clockInTime: string;
  clockOutTime: string;
  didNotWork: boolean;
  empId: number;
  hasbeeninvoiced: boolean;
  isResidual: boolean;
  reportedCanceled: boolean;
  shiftId: number;
  notes: string;
}
