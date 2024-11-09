import axios from "axios";
import { EmployeeDTO } from "../Data/DTOInterfaces/EmployeeDTOInterface";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import { useState } from "react";

export const useEmployeeRequests = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const getEmployeeByEmail = async (email: string): Promise<Employee> => {
    const response = await axios.get(`/api/Employee/getByEmail/${email}`);
    return response.data;
  };

  const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await axios.get(`/api/Employee/get/${id}`);
    return response.data;
  };

  const addEmployee = async (employee: EmployeeDTO) => {
    await axios.post(`/api/Employee/add`, employee);
  };

  const editEmployee = async (employee: Employee) => {
    await axios.put(`/api/Employee/edit`, employee);
  };

  const getAllEmployees = async (): Promise<Employee[]> => {
    const response = await axios.get(`/api/Employee/getAll`);
    return response.data;
  };

  const setEmployeesList = async () => {
    setEmployees(await getAllEmployees());
  };

  return {
    employees,
    getEmployeeByEmail,
    getEmployeeById,
    addEmployee,
    editEmployee,
    getAllEmployees,
    setEmployeesList,
  };
};

export const getEmployeeByEmail = async (email: string): Promise<Employee> => {
  const response = await axios.get(`/api/Employee/getByEmail/${email}`);
  return response.data;
};
