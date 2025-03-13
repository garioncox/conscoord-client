import {
  useAddCompanyMutation,
  useAllCompanies,
} from "@/Functions/Queries/CompanyQueries";
import {
  useEditEmployeeMutation,
  useAddEmployeeMutation,
  useAllEmployees,
} from "@/Functions/Queries/EmployeeQueries";
import { useEmpShiftHistoryForEmail } from "@/Functions/Queries/EmployeeShiftQueries";
import { useAllRoles } from "@/Functions/Queries/RoleQueries";
import { useState } from "react";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { useGPhoneInput } from "@/Components/Generics/control/gPhoneInputController";
import { useDebounce } from "use-debounce";

export const useUserInfoControl = () => {
  const { mutateAsync: addCompanyMutation, isPending: isAddingCompany } =
    useAddCompanyMutation();

  const editEmployeeMutation = useEditEmployeeMutation();
  const addEmployeeMutation = useAddEmployeeMutation();

  const { data: Employees, isLoading: isEmployeesLoading } = useAllEmployees();
  const { data: roles, isLoading: isRolesLoading } = useAllRoles();
  const { data: companies, isLoading: isCompaniesLoading } = useAllCompanies();

  const [companyName, setCompanyName] = useState<string>();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
  const [employeeCompanyId, setEmployeeCompanyId] = useState<number>(0);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRoleId, setEmployeeRoleId] = useState(0);
  const [filterString, setFilterString] = useState("");
  const [isAddingEmployee, setIsAddingEmployee] = useState<boolean>(false);
  const [cardView, setCardView] = useState<"info" | "history" | "none">("none");
  const [debouncedEmail] = useDebounce(employeeEmail, 500); // 500ms delay

  const phoneControl = useGPhoneInput("", () => "");
  const { data: empHistory, isLoading: isEmpHistoryLoading } =
    useEmpShiftHistoryForEmail(debouncedEmail);

  const isLoading = isEmployeesLoading || isRolesLoading || isCompaniesLoading;

  function AddEmployee() {
    const employee = {
      id: null,
      name: employeeName,
      email: employeeEmail,
      phonenumber: phoneControl.value,
      roleid: employeeRoleId,
      companyid: employeeCompanyId,
    };

    addEmployeeMutation.mutate(employee);
    HandleSelectEmployee(null);
  }

  async function EditEmployee() {
    const newCompanyId = companyName
      ? await addCompanyMutation({ companyName })
      : employeeCompanyId;
    setEmployeeCompanyId(newCompanyId);

    if (!selectedEmployee) return;
    if (!IsEmployeeEdited(newCompanyId)) return;

    const employee = {
      id: selectedEmployee.id,
      name: employeeName,
      email: employeeEmail,
      phonenumber: phoneControl.value,
      roleid: employeeRoleId,
      companyid: newCompanyId,
    };

    editEmployeeMutation.mutate(employee);
  }

  const HandleSaveEmployee = async () => {
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
      phoneControl.setValue(selectedEmployee.phonenumber);
      setEmployeeRoleId(selectedEmployee.roleid);
      setEmployeeCompanyId(selectedEmployee.companyid);
    } else {
      setSelectedEmployee(undefined);
      setEmployeeName("");
      setEmployeeEmail("");
      phoneControl.setValue("");
      setEmployeeRoleId(0);
      setEmployeeCompanyId(0);
    }
  };

  const IsEmployeeEdited = (newCompanyId: number) => {
    if (!selectedEmployee) {
      return false;
    }

    if (
      employeeName == selectedEmployee.name &&
      employeeEmail == selectedEmployee.email &&
      phoneControl.value == selectedEmployee.phonenumber &&
      employeeRoleId == selectedEmployee.roleid &&
      newCompanyId == selectedEmployee.companyid
    ) {
      return false;
    }

    return true;
  };

  return {
    cardView,
    companies,
    companyName,
    Employees,
    empHistory,
    employeeCompanyId,
    employeeEmail,
    employeeName,
    employeeRoleId,
    filterString,
    HandleSaveEmployee,
    HandleSelectEmployee,
    isAddingCompany,
    isAddingEmployee,
    isEmpHistoryLoading,
    isLoading,
    phoneControl,
    roles,
    selectedEmployee,
    setCardView,
    setCompanyName,
    setEmployeeCompanyId,
    setEmployeeEmail,
    setEmployeeName,
    setEmployeeRoleId,
    setFilterString,
    setIsAddingEmployee,
  };
};
