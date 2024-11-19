import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";
import { Spinner } from "@/Components/Spinner";
import { useNavigate } from "react-router-dom";


function ShiftList() {

  const { data: shifts, isLoading } = useAllShifts();
  const control = usePaginatedTable(shifts ?? []);

  if (isLoading) {
    return <Spinner />;
  }

  const navigate = useNavigate();

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`)
  }

  return (
    <div>
      <h1 className="text-4xl pb-5">Available Shifts</h1>
      <PaginatedTable paginatedTableControl={control}>
        <EmployeeShiftTable
          data={control.currentItems}
          setRowClicked={() => { clickOnAShift }}
        />
      </PaginatedTable>

    </div>
  );
}

export default ShiftList;
