import { PaginatedTable } from "@/Components/paginated-table";
import { usePagination } from "@/Components/PaginatedTableHook";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/Tables/EmployeeShiftTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Shift } from "@/Data/Interfaces/Shift";
import ShiftSort from "@/Components/Sorting/ShiftSort";
import { useAuth } from "react-oidc-context";
import { Spinner } from "@/Components/Spinner";

function ShiftList() {
  const { isLoading: isAuthLoading } = useAuth();
  const { data: shifts, isLoading } = useAllShifts();
  const navigate = useNavigate();
  const [sortedData, setSortedData] = useState<Shift[] | null>([]);
  const control = usePagination(sortedData || []);

  useEffect(() => {
    if (shifts) {
      const defaultSort = [...shifts].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setSortedData(defaultSort);
    }
  }, [shifts]);

  if (isLoading || isAuthLoading) {
    return <Spinner />;
  }

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`);
  };

  return (
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl pb-5">Available Shifts</h1>
      <div className="overflow-y-auto max-h-[80%]">
        <PaginatedTable control={control}>
          <ShiftSort data={sortedData!} onSortChange={setSortedData} />
          <EmployeeShiftTable
            data={control.currentItems}
            setRowClicked={clickOnAShift}
          />
        </PaginatedTable>
      </div>
    </div>
  );
}

export default ShiftList;
