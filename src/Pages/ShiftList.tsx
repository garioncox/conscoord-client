import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/Tables/EmployeeShiftTable";
import { Spinner } from "@/Components/Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Shift } from "@/Data/Interfaces/Shift";
import ShiftSort from "@/Components/Sorting/ShiftSort";

function ShiftList() {
  const { data: shifts, isLoading } = useAllShifts();
  const navigate = useNavigate();
  const [sortedData, setSortedData] = useState<Shift[] | null>([]);
  const control = usePaginatedTable(sortedData || []);

  useEffect(() => {
    if (shifts) {
      const defaultSort = [...shifts].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setSortedData(defaultSort);
    }
  }, [shifts]);

  if (isLoading) {
    return <Spinner />;
  }

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`);
  };

  return (
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl pb-5">Available Shifts</h1>
      <div className="overflow-y-auto max-h-[650px]">
      <PaginatedTable paginatedTableControl={control}>
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
