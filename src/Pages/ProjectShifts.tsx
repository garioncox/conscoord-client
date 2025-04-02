import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PaginatedTable } from "@/Components/paginated-table";
import { Project } from "@/Data/Interfaces/Project";
import { usePagination } from "@/Components/PaginatedTableHook";
import { ShiftTable } from "@/Components/Tables/ShiftTable";
import { useProjectShiftsByProjectId } from "@/Functions/Queries/ProjectShiftQueries";
import { useAllEmployees } from "@/Functions/Queries/EmployeeQueries";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import {
  useAllProjects,
  useArchiveProjectMutation,
} from "@/Functions/Queries/ProjectQueries";
import { Spinner } from "@/Components/Spinner";
import Modal from "@/Components/Modal";
import { useArchiveShiftMutation } from "@/Functions/Queries/ShiftQueries";
import PermissionComponentLock from "@/Components/Auth/PermissionComponentLock";
import { ADMIN_ROLE, CLIENT_ROLE } from "@/Components/Auth/PermissionLock";
import ShiftSort from "@/Components/Sorting/ShiftSort";
import { Shift } from "@/Data/Interfaces/Shift";
import { useAuth } from "react-oidc-context";
import { AddShift } from "@/Components/AddShift";
import { CirclePlus } from "lucide-react";

const ProjectShifts = () => {
  const { isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: shifts, isLoading: shiftLoading } = useProjectShiftsByProjectId(
    Number(id)
  );
  const { data: projects, isLoading: projectsLoading } = useAllProjects();
  const { data: employees, isLoading: employeesLoading } = useAllEmployees();
  const [contactPerson, setContactPerson] = useState<Employee | null>(null);
  const [currentProject, setCurrentProject] = useState<Project>();

  const [sortedData, setSortedData] = useState<Shift[] | null>([]);
  const control = usePagination(
    sortedData?.filter((s) => s.status !== "ARCHIVED") || []
  );

  useEffect(() => {
    if (shifts) {
      const defaultSort = [...shifts].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setSortedData(defaultSort);
    }
  }, [shifts]);

  const archiveProjectMutation = useArchiveProjectMutation();
  const archiveShiftMutation = useArchiveShiftMutation();

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
        setContactPerson(contactPerson || null);
      }
    }
  }, [
    projectsLoading,
    employeesLoading,
    currentProject,
    projects,
    employees,
    id,
  ]);

  if (projectsLoading || shiftLoading || employeesLoading || authLoading) {
    <Spinner />;
  }

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const toggleCancelModal = () => setIsCancelModalOpen(!isCancelModalOpen);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const toggleAddModal = () => setIsAddModalOpen(!isAddModalOpen);

  const clickOnAShift = (id: number) => {
    navigate(`/shift/view/details/${id}`);
  };

  const archiveProject = () => {
    if (!currentProject || !currentProject.id) return;
    archiveProjectMutation.mutate(currentProject);
    if (shifts)
      shifts.forEach((shift) => {
        archiveShiftMutation.mutate({ shiftId: shift.id, makeToast: false });
      });
  };

  return (
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl">Viewing Project</h1>
      <h2 className="text-center capitalize font-semibold">
        Name: {currentProject?.name} <br />
        Location: {currentProject?.location} <br />
        {currentProject?.status}
      </h2>
      <div>
        {contactPerson ? (
          <>
            <h1 className="mb-1 text-2xl">Point of Contact:</h1>
            <div className="text-center mb-4">
              <p>{contactPerson.name}</p>
              <p>{contactPerson.phonenumber}</p>
              <p>{contactPerson.email}</p>
            </div>
          </>
        ) : (
          <div className="text-center m-8">
            No contact person listed for this project
          </div>
        )}
      </div>
      <PaginatedTable control={control}>
        <ShiftSort
          data={sortedData!}
          onSortChange={setSortedData}
          psoRole={true}
        />
        <ShiftTable data={control.currentItems} setRowClicked={clickOnAShift} />

        <PermissionComponentLock roles={[CLIENT_ROLE, ADMIN_ROLE]}>
          <button
            onClick={() => toggleAddModal()}
            className="border rounded-lg hover:bg-slate-200 hover:border-slate-300 h-10 w-10 flex items-center justify-center"
          >
            <CirclePlus className="h-4 w-4" />
          </button>
          {isAddModalOpen === true && (
            <AddShift
              projectId={Number(id)}
              toggleModal={toggleAddModal}
              isModalOpen={isAddModalOpen}
            />
          )}
        </PermissionComponentLock>
      </PaginatedTable>
      <PermissionComponentLock roles={[ADMIN_ROLE]}>
        <div className="flex justify-end mt-2">
          <button
            onClick={toggleCancelModal}
            disabled={currentProject?.status === "ARCHIVED"}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Cancel Project
          </button>
        </div>
      </PermissionComponentLock>

      <Modal isOpen={isCancelModalOpen} onClose={toggleCancelModal}>
        <div>
          <div>
            <p>
              Are you sure you want to cancel this project? You cannot undo this
              action.
            </p>
          </div>
          <div className="flex grow flex-row mt-5">
            <button
              onClick={toggleCancelModal}
              className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
            >
              Close
            </button>
            <button
              onClick={archiveProject}
              className="p-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Yes, Cancel Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectShifts;
