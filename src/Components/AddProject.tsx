import { Save } from "lucide-react";
import GDateInput from "./Generics/gDateInput";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import { TableCell, TableRow } from "./ui/table";
import { useGDateInput } from "./Generics/gDateInputController";
import { ProjectDTO } from "@/Data/DTOInterfaces/ProjectDTO";
import { FormatDate } from "@/Functions/FormatDates";
import { useAddProjectMutation } from "@/Functions/Queries/ProjectQueries";
import { useState } from "react";
import { useAddEmployeeMutation, useGetEmployeeByEmail, useLoggedInEmployee } from "@/Functions/Queries/EmployeeQueries";
import Modal from "./Modal";
import { useGEmailInput, validateEmail } from "./Generics/gEmailInputController";
import { useGPhoneInput, validatePhone } from "./Generics/gPhoneInputController";
import {  } from "@/Functions/EmployeeRequests";

export function AddProject() {
  const [selfAsContact, setSelfAsContact] = useState<boolean>(true);
  const { data: loggedInEmployee } = useLoggedInEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const addEmployeeMutation = useAddEmployeeMutation();

  const location = useGTextInput("", (v) =>
    v.length === 0 ? "Pleae add a location" : ""
  );

  const startDate = useGDateInput("", (s: string) => {
    if (s === "") {
      return "Start date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "Start date cannot be in the past";
    }

    return "";
  });

  const endDate = useGDateInput("", (s: string) => {
    if (s === "") {
      return "End date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "End date cannot be in the past";
    }
    if (startDate.value !== "" && s < endDate.value) {
      return "End date cannot be before start date";
    }

    return "";
  });

  const description = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a name" : ""
  );

  const name = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a name" : ""
  );

  const email = useGEmailInput("", validateEmail);
  const phonenumber = useGPhoneInput("", validatePhone);

  const addProjectMutation = useAddProjectMutation();
  const { refetch: fetchEmployee, data: newEmp } = useGetEmployeeByEmail(email.value);

  function ProjectControl(id:number) {
    if (selfAsContact) {
      AddProject(id);
    } else {
      toggleModal();
      return;
    }
  }

  function AddProject(id: number) {
    if (!loggedInEmployee) { console.log("No employee found"); return; }
    const project: ProjectDTO = {
      name: description.value,
      location: location.value,
      startDate: FormatDate(startDate.value),
      endDate: FormatDate(endDate.value),
      contactinfo:id,
    };
    addProjectMutation.mutate({ project });
  }

  function AddEmployee() {
    addEmployeeMutation.mutate({
      name: name.value,
      email: email.value,
      phonenumber: phonenumber.value,
    });
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <div>
            <GTextInput control={description} />
          </div>
        </TableCell>
        <TableCell>
          <div className="">
            <GTextInput control={location} />
          </div>
        </TableCell>
        <TableCell>
          <div>
            <GDateInput control={startDate} />
          </div>
        </TableCell>
        <TableCell>
          <div>
            <GDateInput control={endDate} />
          </div>
        </TableCell>

        <TableCell className="p-4">
          <label htmlFor="remember">
            Your contact info listed?
            <div>
              <input type="checkbox" className="checkbox" onChange={() => setSelfAsContact(!selfAsContact)} checked={selfAsContact} name="YourContact" id="Contact" />
            </div>
          </label>
        </TableCell>
        <TableCell>
          <div onClick={() => ProjectControl(loggedInEmployee?.id ? loggedInEmployee?.id : -1)} className="text-primary hover:text-secondary">
            <Save />
          </div>
        </TableCell>
      </TableRow>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="">
          <div>
            <h1>Add contact info</h1>
            <label>Name
              <GTextInput control={name} />
            </label>
            <label>Email
              <GTextInput control={email} />
            </label>
            <label>Phone Number
              <GTextInput control={phonenumber} />
            </label>
          </div>
          <div className="flex grow flex-row mt-5">
            <button
              onClick={toggleModal}
              className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
            >
              Close
            </button>
            <button
              onClick={async () => {
                AddEmployee();
                await fetchEmployee(); 
                if (newEmp)
                  await AddProject(newEmp.id);
                email.setValue("");
                phonenumber.setValue("");
                name.setValue("");
                toggleModal();
              }}
              className="p-2 px-4 bg-green-500 hover:bg-green-600 text-black rounded"
            >
              Add Contact Info
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}