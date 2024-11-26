import { Project } from "@/Data/Interfaces/Project";
import { FC } from "react";

interface ProjectSortProps {
  onSortChange: (sortedData: Project[]) => void;
  data: Project[];
}

const ProjectSort: FC<ProjectSortProps> = ({ onSortChange, data }) => {
  const sortMethods: { [key: string]: (a: Project, b: Project) => number } = {
    startDateAsc: (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    startDateDesc: (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    endDateAsc: (a, b) =>
      new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    endDateDesc: (a, b) =>
      new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
    Name: (a, b) => a.name.localeCompare(b.name),
    Location: (a, b) => a.location.localeCompare(b.location),
  };

  const handleSortChange = (sortValue: string) => {
    if (!sortValue) return;

    const sortFunction = sortMethods[sortValue];
    const sortedData = sortFunction ? [...data].sort(sortFunction) : data;

    onSortChange(sortedData);
  };

  return (
    <>
      <label className="mr-3">Sort By</label>
      <select
        className="text-black"
        defaultValue=""
        onChange={(e) => {
          handleSortChange(e.target.value);
        }}
      >
        <option value="" disabled>
          Choose A Sort Value
        </option>
        <option value="Name">Name</option>
        <option value="Location">Location</option>
        <option value="startDateAsc">Soonest First</option>
        <option value="startDateDesc">Latest First</option>
        <option value="endDateAsc">Soonest End Date First</option>
        <option value="endDateDesc">Latest End Date First</option>
      </select>
    </>
  );
};

export default ProjectSort;
