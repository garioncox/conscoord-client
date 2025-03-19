export interface InvoiceInfoDTO {
    projectId: number;
    projectName: string;
    shiftsByProject: ShiftInfo[];
  }
  
  export interface ShiftInfo {
    shiftId: number;
    shiftLocation: string;
    employeesByShift: EmployeeInfo[];
  }
  
  export interface EmployeeInfo {
    employeeId: number;
    employeeName: string;
    employeePayRate: number;
    hoursWorked: number;
    has_been_invoiced: boolean;
    is_residual: boolean;
  }