import {
  CalendarDays,
  ClockIcon,
  IdCard,
  InfoIcon,
  PlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AddProject } from "../AddProject";
import { Project, STATUS_ARCHIVED } from "@/Data/Interfaces/Project";
import PermissionComponentLock from "../Auth/PermissionComponentLock";
import { CLIENT_ROLE, ADMIN_ROLE } from "../Auth/PermissionLock";
import { Spinner } from "../Spinner";
import Error from "../Error";
import { useProjectUtils } from "../ProjectUtils";
import { useAuth } from "react-oidc-context";
import { useCompanyNameByProjectId } from "@/Functions/Queries/CompanyQueries";

export function ProjectCards({
  data,
  setRowClicked,
}: {
  data: Project[];
  setRowClicked: (id: number) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortedData, setSortedData] = useState<Project[]>(data);

  const projectUtils = useProjectUtils();
  const { isLoading: isAuthLoading } = useAuth();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  if (projectUtils.isLoading || isAuthLoading) {
    return <Spinner />;
  }

  if (projectUtils.isError) {
    return <Error />;
  }

  return (
    <>
      <div className="flex-1">
        <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {sortedData.map((project) => {
            const contact = projectUtils.getContactInfo(project);
            const {
              data: companyName,
              isLoading,
              isError,
            } = useCompanyNameByProjectId(project.id);

            if (isLoading || isError) {
              return <></>;
            }

            return (
              <div
                className={`
                group flex flex-col h-[345px] w-auto p-3 pt-2 border border-slate-300 bg-slate-50 rounded-xl shadow-sm shadow-slate-100 cursor-pointer
                hover:bg-slate-200 transition-transform transform hover:scale-105
              `}
                onClick={() => setRowClicked(project.id)}
                key={project.id}
              >
                <div className="flex flex-row justify-around">
                  <div className="me-auto font-bold text-xs text-red-400">
                    P{project.id}
                  </div>

                  <div className="flex flex-row items-center opacity-50 text-xs">
                    <ClockIcon className="me-1 h-4 w-4" />{" "}
                    {projectUtils.getTimeLength(project)} Day(s)
                  </div>
                </div>

                <div className="font-bold text-lg line-clamp-1">
                  {project.name}
                </div>

                <div className="text-sm border rounded-lg max-w-fit px-2 line-clamp-1 bg-slate-200 group-hover:bg-slate-300">
                  {companyName}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.status == STATUS_ARCHIVED && (
                    <div className="text-sm border rounded-lg max-w-fit px-2 border-red-300 bg-red-200">
                      Archived
                    </div>
                  )}
                  {projectUtils.isComplete(project) && (
                    <div className="text-sm border rounded-lg max-w-fit px-2 border-green-300 bg-green-200">
                      Complete
                    </div>
                  )}
                </div>

                {project.description && (
                  <div className="flex flex-row items-start mt-2 text-sm">
                    <InfoIcon className="me-1 h-auto min-w-6" />
                    <div className="line-clamp-5">{project.description}</div>
                  </div>
                )}

                {project.contactinfo && (
                  <div className="flex flex-row items-start mt-2 text-sm">
                    <IdCard className="me-1 h-auto min-w-6" />
                    <div>
                      <div className="font-semibold">{contact?.name}</div>
                      <div>{contact?.email}</div>
                      <div>{contact?.phonenumber}</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-row mt-auto items-start text-xs justify-end">
                  <CalendarDays className="me-1 h-auto min-w-4 max-w-4" />
                  <div>{projectUtils.getShiftsAvailable(project)} shifts</div>
                </div>

                <div className="flex mt-2 pt-2 border-t justify-center opacity-50 font-semibold text-xs group-hover:border-slate-300">
                  {projectUtils.getDateRangeString(project)}
                </div>
              </div>
            );
          })}

          <PermissionComponentLock roles={[CLIENT_ROLE, ADMIN_ROLE]}>
            <div
              className={`rounded-xl p-3 h-[345px] w-auto border-slate-300 border bg-slate-200 shadow-sm shadow-slate-100 cursor-pointer transition-transform transform hover:scale-105 group flex items-center justify-center`}
              onClick={() => toggleModal()}
              key={"add"}
            >
              <PlusIcon className="opacity-25 scale-[3]" />
            </div>
          </PermissionComponentLock>
        </div>
      </div>

      {isModalOpen && (
        <AddProject toggleModal={toggleModal} isModalOpen={isModalOpen} />
      )}
    </>
  );
}
