import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";
import { Spinner } from "@/Components/Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ShiftList() {
  const { data: shifts, isLoading } = useAllShifts();
  const navigate = useNavigate();
  const control = usePaginatedTable(shifts);

  console.log(shifts)
  useEffect(() => {
    console.log("Shifts have changed:", shifts);
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
      <PaginatedTable paginatedTableControl={control}>
        <EmployeeShiftTable
          data={control.currentItems}
          setRowClicked={clickOnAShift}
        />
      </PaginatedTable>
    </div>
  );
}

export default ShiftList;
