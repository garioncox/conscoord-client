import { EmployeeHistoryDTO } from "@/Data/DTOInterfaces/EmployeeHistoryDTO";
import KebabMenu from "./Kebab";

export const ShiftRow: React.FC<{
  shift: EmployeeHistoryDTO;
  employeeId?: number;
}> = ({ shift, employeeId }) => (
  <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 p-5 border-b">
    <p className="sm:col-span-2">{new Date(shift.date).toLocaleDateString()}</p>
    <p className="sm:col-span-4">{shift.projectName}</p>
    <p className="sm:col-span-4">{shift.location}</p>
    <p className="sm:col-span-1 text-center">
      {shift.hours.slice(0, 3)} {shift.hours === "--" ? "" : " hr"}
    </p>
    <p className="sm:col-span-1 text-right">
      <KebabMenu shiftId={shift.shiftId} employeeId={employeeId} />
    </p>
  </div>
);
