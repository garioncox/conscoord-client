import { EmployeeDTO } from "../Data/DTOInterfaces/EmployeeDTOInterface";
import { httpRequest } from "./HttpRequest";

export const getUserByEmail = async (userEmail: string) => {
  const response = await fetch(`/api/Employee/GetEmployeeByEmail/${userEmail}`);
  if (response.status != 200) {
    return;
  } else {
    const data = await response.json();
    return data;
  }
};

export const createNewUser = async (newUser: EmployeeDTO) => {
  try {
    const response = await httpRequest(
      "/api/Employee/PostEmployee",
      newUser,
      "POST"
    );
    console.log(`response from creating user was ${response}`);
  } catch {
    console.error("user was not created");
  }
};
