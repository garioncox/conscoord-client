import "../index.css";
import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { EmployeeTable } from "@/Components/Tables/EmployeeTable";
import { Spinner } from "@/Components/Spinner";
import { useAllEmployees } from "@/Functions/Queries/EmployeeQueries";

export const EmployeeList = () => {
  const { data: employees } = useAllEmployees();
  const control = usePaginatedTable(employees ?? []);

  const contents =
    employees === undefined ? (
      <Spinner />
    ) : (
      <PaginatedTable paginatedTableControl={control}>
        <EmployeeTable data={control.currentItems} />
      </PaginatedTable>
    );
  return (
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl pb-5">Admin Employee View</h1>
      {contents}
    </div>
  );
};

export default EmployeeList;
