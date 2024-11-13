import { useEffect, useState } from "react";
import { useProjectRequests } from "@/Functions/ProjectRequests";
import { useNavigate, useParams } from "react-router-dom";
import { Shift } from "@/Data/Interfaces/Shift";
import { useProjectShiftRequests } from "@/Functions/ProjectShiftRequests";
import { PaginatedTable } from "@/Components/paginated-table";
import { Project } from "@/Data/Interfaces/Project";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { getAllShifts } from "@/Functions/ShiftRequests";
import { useEmployeeRequests } from "@/Functions/EmployeeRequests";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";

const ProjectShifts = () => {
  const { getAllProjectShifts } = useProjectShiftRequests();
  const { getAllProjects } = useProjectRequests();
  const { getEmployeeById } = useEmployeeRequests();
  const navigate = useNavigate();
  const { id } = useParams();

  const [ShiftsToProject, setShiftsToProject] = useState<Shift[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>();
  const [contactPerson, setContactPerson] = useState<Employee>();

  const control = usePaginatedTable(ShiftsToProject ?? []);

  useEffect(() => {
    populateProjectShifts();
    if (currentProject?.contactinfo) {
      getEmployeeById(currentProject.contactinfo).then((newContact) => {
        setContactPerson((prev) => {
          if (prev?.id === newContact.id) {
            return prev;
          }
          return newContact;
        });
      });
    }
  }, [currentProject?.contactinfo]);

  async function populateProjectShifts() {
    const projectShifts = await getAllProjectShifts();
    const shifts = await getAllShifts();

    const allProjects = await getAllProjects();
    const currProject = allProjects.find((p) => p.id === Number(id));

    const filteredProjectShifts = projectShifts.filter(
      (ps) => ps.projectId === Number(id)
    );

    const projectShiftIds = filteredProjectShifts.map((ps) => ps.shiftId);
    const matchingShifts = shifts.filter((shift) =>
      projectShiftIds.includes(shift.id)
    );

    setShiftsToProject(matchingShifts);
    setCurrentProject(currProject);
  }

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`)
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl text-extrabold">Viewing Project:</h1>
      <h2 className="text-center">
        {currentProject?.name} <br />
        {currentProject?.location} <br />
        {currentProject?.status}
      </h2>
      <div>
        {contactPerson
          ?
          <>
            <h1 className="mb-1 text-2xl">Point of Contact:</h1>
            <h2 className="text-center mb-4">
              {contactPerson.name} - {contactPerson.phonenumber ? contactPerson.phonenumber : contactPerson.email}
            </h2>
          </>
          :
          <div className="text-center m-8">No contact person listed for this project</div>
        }
      </div>
      <PaginatedTable paginatedTableControl={control}>
        <EmployeeShiftTable data={control.currentItems} setRowClicked={clickOnAShift} />
      </PaginatedTable>
    </div>
  );
};

export default ProjectShifts;
