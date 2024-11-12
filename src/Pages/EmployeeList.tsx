import { useEffect } from "react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useRoleRequests } from "../Functions/RoleRequests";
import "../index.css";
import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { EmployeeTable } from "@/Components/EmployeeTable";
import { Spinner } from "@/Components/Spinner";

export const EmployeeList = () => {
  const { employees, setEmployeesList } = useEmployeeRequests();
  const { setRolesList } = useRoleRequests();

  const control = usePaginatedTable(employees ?? []);

  useEffect(() => {
    setEmployeesList();
    setRolesList();
  }, []);

  const contents =
    employees === undefined ? (
      <Spinner />
    ) : (
      <PaginatedTable paginatedTableControl={control}>
        <EmployeeTable data={control.currentItems} />
      </PaginatedTable>
    );
  return (
    <div>
      <h1>Admin Employee View</h1>
      {contents}
    </div>
  );
};

export default EmployeeList;
