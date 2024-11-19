import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";
import { Spinner } from "@/Components/Spinner";
import { useNavigate } from "react-router-dom";




function ShiftList() {
  const navigate = useNavigate();
  const { data: shifts } = useAllShifts();
  const control = usePaginatedTable(shifts ?? []);

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`)
  }

  return (
    <div className="min-w-full px-40">
      <h1 className="text-4xl pb-5">Available Shifts</h1>
      {shifts ? (
        <PaginatedTable paginatedTableControl={control}>
          <EmployeeShiftTable
            data={control.currentItems}
            setRowClicked={clickOnAShift}
          />
        </PaginatedTable>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default ShiftList;
