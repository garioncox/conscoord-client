import axios from "axios";
import { EmployeeDTO } from "../Data/DTOInterfaces/EmployeeDTOInterface";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import Role from "../Data/Interfaces/RoleInterface";
import { Company } from "../Data/Interfaces/Company";
import { ProjectDTO } from "../Data/DTOInterfaces/ProjectDTO";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";
import { Project } from "../Data/Interfaces/Project";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";

export const useApiRequests = () => {
  const getUserByEmail = async (email: string): Promise<Employee> => {
    const response = await axios.get(`/api/Employee/getByEmail/${email}`);
    return response.data;
  };

  const addEmployee = async (employee: EmployeeDTO) => {
    await axios.post(`/api/Employee/add`, employee);
  };

  const getAllEmployees = async (): Promise<Employee[]> => {
    const response = await axios.get(`/api/Employee/getAll`);
    return response.data;
  };

  const getAllRoles = async (): Promise<Role[]> => {
    const response = await axios.get(`/api/Role/getAll`);
    return response.data;
  };

  const getAllProjects = async (): Promise<Project[]> => {
    const response = await axios.get(`/api/Project/getAll`);
    return response.data;
  };

  const getCompanies = async (): Promise<Company[]> => {
    const response = await axios.get(`/api/Company/getAll`);
    return response.data;
  };

  const addProject = async (project: ProjectDTO) => {
    await axios.post(`/api/Project/add`, project);
  };

  const addShift = async (shift: ShiftDTO) => {
    await axios.post(`/api/Shift/add`, shift);
  };

  const editShift = async (id: number, shift: Shift) => {
    await axios.put(`/api/Shift/edit/${id}`, shift);
  };

  const getAllShifts = async (): Promise<Shift[]> => {
    const response = await axios.get(`/api/Shift/getAll`);
    return response.data;
  };

  const addEmployeeShift = async (dto: EmployeeShiftDTO) => {
    await axios.post(`/api/EmployeeShift/add`, dto);
  };

  const getAllArchivedShifts = async (): Promise<Shift[]> => {
    const response = await axios.get(`/api/Shift/getAll/archived`);
    return response.data;
  };

  const archiveShift = async (shiftId: number) => {
    await axios.put(`/api/Shift/archive/${shiftId}`);
  };

  const updateProject = async (project: Project) => {
    await axios.put(`/api/Project/edit/${project.id}`);
  };

  const archiveProject = async (project: Project) => {
    await axios.put(`/api/Project/archive/${project.id}`);
  };

  return {
    getUserByEmail,
    addEmployee,
    getAllEmployees,
    getAllRoles,
    getAllProjects,
    getCompanies,
    addProject,
    addShift,
    editShift,
    getAllShifts,
    addEmployeeShift,
    getAllArchivedShifts,
    archiveShift,
    updateProject,
    archiveProject,
  };
};
