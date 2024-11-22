import { useEffect, useState } from "react";
import { useAllProjects } from "@/Functions/ProjectRequests";
import { useNavigate, useParams } from "react-router-dom";
import { PaginatedTable } from "@/Components/paginated-table";
import { Project } from "@/Data/Interfaces/Project";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { ShiftTable } from "@/Components/ShiftTable";
import { useProjectShiftsByProjectId } from "@/Functions/Queries/ProjectShiftQueries";
import { useAllEmployees } from "@/Functions/Queries/EmployeeQueries";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";

const ProjectShifts = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: shifts, isLoading: shiftLoading } = useProjectShiftsByProjectId(
    Number(id)
  );
  const { data: projects, isLoading: projectsLoading } = useAllProjects();
  const { data: employees, isLoading: employeesLoading } = useAllEmployees();
  const [contactPerson, setContactPerson] = useState<Employee | null>(null);
  const [currentProject, setCurrentProject] = useState<Project>();

  const control = usePaginatedTable(shifts ?? []);

  useEffect(() => {
    if (!projectsLoading && !employeesLoading) {
      const currProject = projects?.find((p) => p.id === Number(id));
      if (!currentProject && currProject) {
        setCurrentProject(currProject);
      }
  
      if (currProject) {
        const contactPerson = employees?.find(
          (e) => e.id === currProject.contactinfo
        );
        console.log("contact me " + contactPerson?.email);
        setContactPerson(contactPerson || null);
      }
    }
  }, [projectsLoading, employeesLoading, projects, employees, id]); 
  

  if (projectsLoading || shiftLoading || employeesLoading) {
    return <div>...Loading</div>;
  }

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`);
  };

  return (
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl pb-5">Viewing Project</h1>
      <h2 className="text-center">
        {currentProject?.name} <br />
        {currentProject?.location} <br />
        {currentProject?.status}
      </h2>
      <div>
        {contactPerson ? (
          <>
            <h1 className="mb-1 text-2xl">Point of Contact:</h1>
            <h2 className="text-center mb-4">
              {contactPerson.name} -{" "}
              {contactPerson.phonenumber
                ? contactPerson.phonenumber
                : contactPerson.email}
            </h2>
          </>
        ) : (
          <div className="text-center m-8">
            No contact person listed for this project
          </div>
        )}
      </div>
      <PaginatedTable paginatedTableControl={control}>
        <ShiftTable
          data={control.currentItems}
          setRowClicked={clickOnAShift}
          projectId={Number(id)}
        />
      </PaginatedTable>
    </div>
  );
};

export default ProjectShifts;
