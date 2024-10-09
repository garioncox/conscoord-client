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

export const getUserByEmail = async (email: string): Promise<Employee> => {
  return await axios.get(`/api/Employee/GetEmployeeByEmail/${email}`);
};

export const addEmployee = async (employee: EmployeeDTO) => {
  await axios.post(`/api/Employee/add`, employee);
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  return await axios.get(`/api/Employee/getAll`);
};

export const getAllRoles = async (): Promise<Role[]> => {
  return await axios.get(`/api/Role/getAll`);
};

export const getAllProjects = async (): Promise<Project[]> => {
  return await axios.get(`/api/Project/getAll`);
};

export const getCompanies = async (): Promise<Company[]> => {
  return await axios.get(`/api/Company/getAll`);
};

export const addProject = async (project: ProjectDTO) => {
  await axios.post(`/api/Project/add`, project);
};

export const addShift = async (shift: ShiftDTO) => {
  await axios.post(`/api/Shift/add`, shift);
};

export const editShift = async (id: number, shift: ShiftDTO) => {
  await axios.post(`/api/Shift/edit/${id}`, shift);
};

export const getAllShifts = async (): Promise<Shift[]> => {
  return await axios.get(`/api/Shift/getAll`);
};

export const addEmployeeShift = async (dto: EmployeeShiftDTO) => {
  await axios.post(`/api/EmployeeShift/add`, dto);
};

export const getAllArchivedShifts = async (): Promise<Shift[]> => {
  return await axios.get(`/api/Shift/getAll/archived`);
};

export const archiveShift = async (shiftId: number) => {
  await axios.post(`/api/Shift/archive/${shiftId}`);
};

export const updateProject = async (project: Project) => {
  await axios.put(`/api/Project/edit/${project.id}`);
};
