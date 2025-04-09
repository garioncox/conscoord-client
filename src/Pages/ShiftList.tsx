import { PaginatedTable } from "@/Components/paginated-table";
import { usePagination } from "@/Components/PaginatedTableHook";
import {
  useAllShifts,
  useClaimedShiftsForLoggedInUser,
} from "@/Functions/Queries/ShiftQueries";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Shift } from "@/Data/Interfaces/Shift";
import ShiftSort from "@/Components/Sorting/ShiftSort";
import { useAuth } from "react-oidc-context";
import { Spinner } from "@/Components/Spinner";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";
import { ShiftTable } from "@/Components/Tables/ShiftTable";
import { useShiftsFulfilledUtils } from "@/Components/ShiftsFulfilledHook";

function ShiftList() {
  const { shiftFraction } = useShiftsFulfilledUtils();
  const { isLoading: isAuthLoading } = useAuth();
  const { data: shifts, isLoading } = useAllShifts();
  const navigate = useNavigate();
  const [sortedData, setSortedData] = useState<Shift[] | null>([]);
  const control = usePagination(sortedData || []);
  const { data: empShifts, isLoading: empShiftsLoading } =
    useAllEmployeeShifts();
  const { data: userShifts, isLoading: shiftsLoading } =
    useClaimedShiftsForLoggedInUser();

  useEffect(() => {
    if (shifts) {
      const defaultSort = [...shifts].sort((a, b) => {
        const employeesAssignedA = empShifts!.filter(
          (es: EmployeeShift) => es.shiftId == a.id
        ).length;
        const employeesNeededA = a.requestedEmployees / employeesAssignedA;

        // Calculate employees assigned and needed for shift 'b'
        const employeesAssignedB = empShifts!.filter(
          (es: EmployeeShift) => es.shiftId == b.id
        ).length;
        const employeesNeededB = b.requestedEmployees / employeesAssignedB;

        // Compare based on employees needed
        return employeesNeededB - employeesNeededA;
      });

      // Filter out past and taken shifts
      const removedData = defaultSort.filter(
        (e) =>
          new Date(e.endTime) >= new Date() &&
          shiftFraction(e) < 1 &&
          !userShifts?.some((userShift) => userShift.id === e.id)
      );

      setSortedData(removedData);
    }
  }, [shifts, empShifts]);

  if (isLoading || isAuthLoading || empShiftsLoading || shiftsLoading) {
    return <Spinner />;
  }

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`);
  };

  return (
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl pb-5">Available Shifts</h1>
      <PaginatedTable control={control}>
        <ShiftSort data={sortedData!} onSortChange={setSortedData} />
        <ShiftTable data={control.currentItems} setRowClicked={clickOnAShift} />
      </PaginatedTable>
    </div>
  );
}

export default ShiftList;
