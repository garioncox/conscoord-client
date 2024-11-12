import { useEffect, useState } from "react";
import { useProjectRequests } from "@/Functions/ProjectRequests";
import { useParams } from "react-router-dom";
import { Shift } from "@/Data/Interfaces/Shift";
import { useProjectShiftRequests } from "@/Functions/ProjectShiftRequests";
import { PaginatedTable } from "@/Components/paginated-table";
import { Project } from "@/Data/Interfaces/Project";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { ShiftTable } from "@/Components/ShiftTable";
import { getAllShifts } from "@/Functions/ShiftRequests";


const ProjectShifts = () => {
  const { getAllProjectShifts } = useProjectShiftRequests();
  const { getAllProjects } = useProjectRequests();
  const { id } = useParams();

  const [ShiftsToProject, setShiftsToProject] = useState<Shift[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>();

  const control = usePaginatedTable(ShiftsToProject ?? []);

  useEffect(() => {
    populateProjectShifts();
  }, []);

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

  return (
    <div>
      <h1>Viewing Project:</h1>
      <h2>
        {currentProject?.name} <br />
        {currentProject?.location} <br />
        {currentProject?.status}
      </h2>
      <PaginatedTable paginatedTableControl={control}>
        <ShiftTable data={control.currentItems} setRowClicked={function (id: number): void {
          throw new Error("Function not implemented.");
        }} />
      </PaginatedTable>

      {ShiftsToProject?.map((stp) => (
        <div key={stp.id}>{stp.description}</div>
      ))}
    </div>
  );
};

export default ProjectShifts;