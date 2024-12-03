import { Check, Save } from "lucide-react";
import GDateInput from "./Generics/gDateInput";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import { TableCell, TableRow } from "./ui/table";
import { useGDateInput } from "./Generics/gDateInputController";
import { ProjectDTO } from "@/Data/DTOInterfaces/ProjectDTO";
import { FormatDate } from "@/Functions/FormatDates";
import { useAddProjectMutation } from "@/Functions/Queries/ProjectQueries";
import { useState } from "react";
import { useLoggedInEmployee } from "@/Functions/Queries/EmployeeQueries";
import OtherContactInfoModal from "./OtherContactInfoModal";
import { toast } from "react-toastify";
import { Checkbox } from "@mui/material";

export function AddProject() {
  const [selfAsContact, setSelfAsContact] = useState<boolean>(true);
  const { data: loggedInEmployee } = useLoggedInEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
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

  const addProjectMutation = useAddProjectMutation();

  function Validate() {
    if (startDate.error || endDate.error || description.error) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  }

  function ProjectControl(id: number) {
    if (!Validate()) return;
    if (selfAsContact) {
      AddProject(id);
    } else {
      toggleModal();
      return;
    }
  }

  function AddProject(id: number) {
    if (!loggedInEmployee) {
      console.log("No employee found");
      return;
    }
    const project: ProjectDTO = {
      name: description.value,
      location: location.value,
      startDate: FormatDate(startDate.value),
      endDate: FormatDate(endDate.value),
      contactinfo: id,
    };
    addProjectMutation.mutate({ project });
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
          <label
            htmlFor="contact"
            title="If an officer needs to contact someone, this will be who they contact while on shift"
          >
            Use your contact info?
            <div>
              <Checkbox
                onChange={() => setSelfAsContact(!selfAsContact)}
                checked={selfAsContact}
                name="YourContact"
                id="Contact"
              />
            </div>
          </label>
        </TableCell>
        <TableCell>
          <div
            onClick={() =>
              ProjectControl(loggedInEmployee?.id ? loggedInEmployee?.id : -1)
            }
            className="text-primary hover:text-secondary"
          >
            <Save />
          </div>
        </TableCell>
      </TableRow>

      <OtherContactInfoModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        AddProject={AddProject}
      />
    </>
  );
}
