import "../index.css";
import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { EmployeeTable } from "@/Components/Tables/EmployeeTable";
import { Spinner } from "@/Components/Spinner";
import { useAllEmployees } from "@/Functions/Queries/EmployeeQueries";
import EmployeeSort from "@/Components/Sorting/EmployeeSort";
import { useEffect, useState } from "react";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";

export const EmployeeList = () => {
  const { data: employees } = useAllEmployees();
  const [sortedData, setSortedData] = useState<Employee[] | null>([]);
  const control = usePaginatedTable(sortedData || []);

  useEffect(() => {
    if (employees) {
      const defaultSort = [...employees].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSortedData(defaultSort);
    }
  }, [employees]);

  const contents =
    employees === undefined ? (
      <Spinner />
    ) : (
      <PaginatedTable paginatedTableControl={control}>
        <EmployeeSort data={sortedData!} onSortChange={setSortedData} />
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
