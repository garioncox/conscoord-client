import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import {
  useEditEmployeeMutation,
  useAddEmployeeMutation,
  useAllEmployees,
} from "@/Functions/Queries/EmployeeQueries";
import { useEmpShiftHistoryForEmail } from "@/Functions/Queries/EmployeeShiftQueries";
import { useAllRoles } from "@/Functions/Queries/RoleQueries";
import { useState } from "react";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";

export const useUserInfoControl = () => {
  const editEmployeeMutation = useEditEmployeeMutation();
  const addEmployeeMutation = useAddEmployeeMutation();

  const { data: Employees, isLoading: isEmployeesLoading } = useAllEmployees();
  const { data: roles, isLoading: isRolesLoading } = useAllRoles();
  const { data: companies, isLoading: isCompaniesLoading } = useAllCompanies();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
  const [employeeCompanyId, setEmployeeCompanyId] = useState(0);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeePhoneNumber, setEmployeePhoneNumber] = useState("");
  const [employeeRoleId, setEmployeeRoleId] = useState(0);
  const [filterString, setFilterString] = useState("");
  const [isAddingEmployee, setIsAddingEmployee] = useState<boolean>(false);
  const [cardView, setCardView] = useState<"info" | "history" | "none">("none");

  const { data: empHistory, isLoading: isEmpHistoryLoading } =
    useEmpShiftHistoryForEmail(employeeEmail);

  const isLoading = isEmployeesLoading || isRolesLoading || isCompaniesLoading;

  function AddEmployee() {
    const employee = {
      id: null,
      name: employeeName,
      email: employeeEmail,
      phonenumber: employeePhoneNumber,
      roleid: employeeRoleId,
      companyid: employeeCompanyId,
    };

    addEmployeeMutation.mutate(employee);
    HandleSelectEmployee(null);
  }

  function EditEmployee() {
    if (!selectedEmployee) return;
    if (!IsEmployeeEdited()) return;

    const employee = {
      id: selectedEmployee.id,
      name: employeeName,
      email: employeeEmail,
      phonenumber: employeePhoneNumber,
      roleid: employeeRoleId,
      companyid: employeeCompanyId,
    };
    editEmployeeMutation.mutate(employee);
  }

  const HandleSaveEmployee = () => {
    if (isAddingEmployee) {
      AddEmployee();
    } else {
      EditEmployee();
    }
  };

  const HandleSelectEmployee = (selectedEmployee: Employee | null) => {
    setIsAddingEmployee(false);

    if (selectedEmployee) {
      setSelectedEmployee(selectedEmployee);
      setEmployeeName(selectedEmployee.name);
      setEmployeeEmail(selectedEmployee.email);
      setEmployeePhoneNumber(selectedEmployee.phonenumber);
      setEmployeeRoleId(selectedEmployee.roleid);
      setEmployeeCompanyId(selectedEmployee.companyid);
    } else {
      setSelectedEmployee(undefined);
      setEmployeeName("");
      setEmployeeEmail("");
      setEmployeePhoneNumber("");
      setEmployeeRoleId(0);
      setEmployeeCompanyId(0);
    }
  };

  const IsEmployeeEdited = () => {
    if (!selectedEmployee) {
      return false;
    }

    if (
      employeeName == selectedEmployee.name &&
      employeeEmail == selectedEmployee.email &&
      employeePhoneNumber == selectedEmployee.phonenumber &&
      employeeRoleId == selectedEmployee.roleid &&
      employeeCompanyId == selectedEmployee.companyid
    ) {
      return false;
    }

    return true;
  };

  return {
    cardView,
    companies,
    Employees,
    empHistory,
    employeeCompanyId,
    employeeEmail,
    employeeName,
    employeePhoneNumber,
    employeeRoleId,
    filterString,
    HandleSaveEmployee,
    HandleSelectEmployee,
    isAddingEmployee,
    isEmpHistoryLoading,
    isLoading,
    roles,
    selectedEmployee,
    setCardView,
    setEmployeeCompanyId,
    setEmployeeEmail,
    setEmployeeName,
    setEmployeePhoneNumber,
    setEmployeeRoleId,
    setFilterString,
    setIsAddingEmployee,
  };
};
