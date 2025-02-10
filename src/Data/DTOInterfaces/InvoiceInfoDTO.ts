export interface InvoiceInfoDTO {
  projectId: number;
  projectName: string;
  shiftsByProject: shiftInfo[];
}

export interface shiftInfo {
  shiftId: number;
  shiftLocation: string;
  employeesByShift: employeeInfo[];
}

export interface employeeInfo {
  employeeId: number;
  employeeName: string;
  employeePayRate: number;
  hoursWorked: number;
}
