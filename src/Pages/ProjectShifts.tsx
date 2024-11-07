import { useEffect, useState } from "react";
import { Company } from "../Data/Interfaces/Company";
import { useProjectRequests } from "@/Functions/ProjectRequests";
import { useParams } from "react-router-dom";
import { useShiftRequests } from "@/Functions/ShiftRequests";
import { Shift } from "@/Data/Interfaces/Shift";
import { useProjectShiftRequests } from "@/Functions/ProjectShiftRequests";
import ProjectShift from "@/Data/Interfaces/ProjectShift";
import { PaginatedTable } from "@/Components/paginated-table";
import { Project } from "@/Data/Interfaces/Project";

const ProjectShifts = () => {
  const { getAllShifts } = useShiftRequests();
  const { getAllProjectShifts } = useProjectShiftRequests();
  const {getAllProjects} = useProjectRequests();
  const { id } = useParams();

  const [ShiftsToProject, setShiftsToProject] = useState<Shift[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | undefined>();

  useEffect(() => {
    populateProjectShifts();
  }, []);

  async function populateProjectShifts() {
    const projectShifts = await getAllProjectShifts();
    const shifts = await getAllShifts();
    const allProjects = await getAllProjects();    
    const currentProject = allProjects.find((p) => p.id === Number(id));

    const filteredProjectShifts = projectShifts.filter(
      (ps) => ps.projectId === Number(id)
    );

    // Step 3: Extract the shiftIds from filteredProjectShifts
    const projectShiftIds = filteredProjectShifts.map((ps) => ps.shiftId);

    // Step 4: Filter the main shifts array by matching shiftIds
    const matchingShifts = shifts.filter((shift) =>
      projectShiftIds.includes(shift.id)
    );

    // Now set the shifts that match projectShifts to the state
    setShiftsToProject(matchingShifts);
    console.log("currentProject " + currentProject)
    console.log("shiftsToProject is " + ShiftsToProject);
  }

  return (
    <div>
        <h1>Viewing Project:</h1>
        {currentProject ? (
  <PaginatedTable 
    data={currentProject} 
    tableHeaders={["Name", "Location", "Start Date", "End Date", "Status"]} 
    rows={["name", "location", "startDate", "endDate", "status"]} 
  />
) : (
  <p>Loading project data...</p>
)}
      <PaginatedTable
              data={ShiftsToProject}
              tableHeaders={[
                  "Location",
                  "Start Time",
                  "End Time",
                  "Description",
                  "Requested Employees",
                  "Status",
              ]}
              rows={[
                  "location",
                  "startTime",
                  "endTime",
                  "description",
                  "requestedEmployees",
                  "status",
              ]} setRowClicked={function (id: number): void {
                  throw new Error("Function not implemented.");
              } }      ></PaginatedTable>
      {ShiftsToProject?.map((stp) => (
        <div key={stp.id}>{stp.description}</div>
      ))}
    </div>
  );
};

export default ProjectShifts;
