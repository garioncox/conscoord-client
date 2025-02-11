import { Minus, Save } from "lucide-react";
import GDateInput from "./Generics/gDateInput";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/control/gTextInputController";
import { useGDateInput } from "./Generics/control/gDateInputController";
import { ProjectDTO } from "@/Data/DTOInterfaces/ProjectDTO";
import { FormatDate } from "@/Functions/FormatDates";
import { useAddProjectMutation } from "@/Functions/Queries/ProjectQueries";
import { useState } from "react";
import {
  useAddEmployeeMutation,
  useLoggedInEmployee,
} from "@/Functions/Queries/EmployeeQueries";
import { Checkbox } from "@mui/material";
import Modal from "./Modal";
import {
  useGEmailInput,
  validateEmail,
} from "./Generics/control/gEmailInputController";
import {
  useGPhoneInput,
  validatePhone,
} from "./Generics/control/gPhoneInputController";
import GEmailInput from "./Generics/gEmailInput";
import GPhoneInput from "./Generics/gPhoneInput";
import { useEmployeeRequests } from "@/Functions/EmployeeRequests";
import { toast } from "react-toastify";

export const AddProject: React.FC<{
  toggleModal: () => void;
  isModalOpen: boolean;
}> = ({ toggleModal, isModalOpen }) => {
  const [selfAsContact, setSelfAsContact] = useState<boolean>(true);
  const addEmployeeMutation = useAddEmployeeMutation();
  const employeeRequests = useEmployeeRequests();
  const { data: loggedInEmployee } = useLoggedInEmployee();

  // Main Form Input
  const locationControl = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a location" : ""
  );

  const startDateControl = useGDateInput("", (s: string) => {
    if (s === "") {
      return "Start date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "Start date cannot be in the past";
    }

    return "";
  });

  const endDateControl = useGDateInput("", (s: string) => {
    if (s === "") {
      return "End date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "End date cannot be in the past";
    }
    if (startDateControl.value !== "" && s < endDateControl.value) {
      return "End date cannot be before start date";
    }

    return "";
  });

  const nameControl = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a name" : ""
  );

  // Contact Form Input
  const contactNameControl = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a name" : ""
  );

  const contactEmailControl = useGEmailInput("", validateEmail);
  const contactPhoneControl = useGPhoneInput("", validatePhone);

  const addProjectMutation = useAddProjectMutation();

  const ValidateMainForm = () => {
    locationControl.setHasBeenTouched(true);
    startDateControl.setHasBeenTouched(true);
    endDateControl.setHasBeenTouched(true);
    nameControl.setHasBeenTouched(true);

    return !(
      locationControl.error ||
      startDateControl.error ||
      endDateControl.error ||
      nameControl.error
    );
  };

  function ValidateContactForm() {
    contactEmailControl.setHasBeenTouched(true);
    contactNameControl.setHasBeenTouched(true);
    contactPhoneControl.setHasBeenTouched(true);

    return !(
      contactEmailControl.error ||
      contactNameControl.error ||
      contactPhoneControl.error
    );
  }

  async function AddEmployee() {
    try {
      const existingEmp = await employeeRequests.getEmployeeByEmail(
        contactEmailControl.value
      );

      if (existingEmp) {
        return existingEmp;
      }
    } catch {
      const employeeData = loggedInEmployee
        ? {
            name: contactNameControl.value,
            email: contactEmailControl.value,
            phonenumber: contactPhoneControl.value,
            companyId: loggedInEmployee.companyid,
          }
        : {
            name: contactNameControl.value,
            email: contactEmailControl.value,
            phonenumber: contactPhoneControl.value,
          };
      await addEmployeeMutation.mutateAsync(employeeData);
    }

    return employeeRequests.getEmployeeByEmail(contactEmailControl.value);
  }

  // Validation
  async function ValidateAndPost(id: number) {
    if (!ValidateMainForm()) return;

    if (selfAsContact) {
      AddProject(id);
    } else {
      if (!ValidateContactForm()) return;
      try {
        const newEmp = await AddEmployee();
        if (newEmp) {
          AddProject(newEmp.id);
        }

        toggleModal();
      } catch {
        toast.error("Error adding employee or creating project");
      }
    }
  }

  function AddProject(id: number) {
    if (!loggedInEmployee) {
      console.log("No employee found");
      return;
    }
    const project: ProjectDTO = {
      name: nameControl.value,
      location: locationControl.value,
      startDate: FormatDate(startDateControl.value),
      endDate: FormatDate(endDateControl.value),
      contactinfo: id,
    };
    addProjectMutation.mutate({ project });
  }

  return (
    <Modal isOpen={isModalOpen} onClose={toggleModal}>
      <p className="flex font-semibold text-2xl justify-center border-b pb-3">
        Add a Project
      </p>
      <div className="pb-5">
        <GTextInput
          control={nameControl}
          label={"Project Name"}
          maxLength={50}
        />
        <GTextInput
          control={locationControl}
          label={"Location"}
          maxLength={50}
        />
      </div>

      <div className="flex flex-row items-center space-x-3 justify-center pb-5">
        <GDateInput control={startDateControl} label={"Start Date"} />
        <div className="pt-6">
          <Minus />
        </div>
        <GDateInput control={endDateControl} label={"End Date"} />
      </div>

      {!selfAsContact && (
        <div className="border-t border-b pb-5 mb-5">
          <div>
            <p className="flex font-semibold text-xl justify-center pb-3 pt-5">
              Add Contact Info
            </p>
            <div className="mb-5">
              <GTextInput
                control={contactNameControl}
                maxLength={50}
                label="Name"
              />
            </div>
            <div className="flex flex-row items-center justify-around">
              <GEmailInput control={contactEmailControl} />
              <GPhoneInput control={contactPhoneControl} />
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-row grow items-center ps-auto justify-around`}>
        <div className="flex flex-row grow items-center">
          <p title="This is who an officer will contact will on shift, if need be.">
            Use your contact info?
          </p>
          <div>
            <Checkbox
              onChange={() => setSelfAsContact(!selfAsContact)}
              checked={selfAsContact}
              name="YourContact"
            />
          </div>
        </div>

        <div
          onClick={() =>
            ValidateAndPost(loggedInEmployee?.id ? loggedInEmployee?.id : -1)
          }
          className="text-primary hover:text-secondary"
        >
          <Save />
        </div>
      </div>
    </Modal>
  );
};
