export interface EmployeeShift  {
    Id : number
    StartTime : string
    EndTime :string 
    EmpId : number 
    ShiftId: number 

    // Employee : { Emp } //fill out if needed? it's in the server/db object, not sure if we would need it here yet or not 
    // Shift : { Shift } // fill out if needed?
    }