import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useRoleRequests } from "../Functions/RoleRequests";
import "../index.css";
import { useCustomToast } from "../Components/Toast";
import AddOfficer from "./AddOfficer";
import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { EmployeeTable } from "@/Components/EmployeeTable";

export const EmployeeList = () => {
  const { employees, setEmployeesList, getEmployeeById, editEmployee } =
    useEmployeeRequests();
  const { roles, setRolesList } = useRoleRequests();
  const [selectedRole, setSelectedRole] = useState<number | undefined>(-1);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(-1);
  const { createToast } = useCustomToast();
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  const control = usePaginatedTable(employees ?? []);

  useEffect(() => {
    setEmployeesList();
    setRolesList();
  }, []);

  const navigate = useNavigate();

  const updateUserRole = (employeeId: number, currentRoleId: number) => {
    setSelectedEmployee(employeeId);
    setSelectedRole(currentRoleId);
  };

  const saveUserRole = async (id: number) => {
    const employee = await getEmployeeById(id);

    if (employee) {
      const updatedEmployee: Employee = {
        ...employee,
        roleid: selectedRole ? selectedRole : 0,
      };

      await createToast(editEmployee, updatedEmployee, "Updating Employee");
      await setEmployeesList();
      console.log("Employee updated successfully");
    } else {
      console.log("no role selected");
    }

    setSelectedEmployee(null);
    setSelectedRole(undefined);
  };
  const addingEmployee = isAddingEmployee === true ?
  <AddOfficer />
    :
    <tr>
      <button
        className="btn btn-primary"
        onClick={() => setIsAddingEmployee(true)}
      >
        Add Employee
      </button>
    </tr>


  const contents =
    employees === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <PaginatedTable paginatedTableControl={control}>
          <EmployeeTable data={control.currentItems} setRowClicked={function (id: number): void {
            throw new Error("Function not implemented.");
          } } />
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
