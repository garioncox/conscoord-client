import { Project } from "@/Data/Interfaces/Project";
import { MenuItem, Select } from "@mui/material";
import { FC, useEffect, useState } from "react";

interface ProjectSortProps {
  onSortChange: (sortedData: Project[]) => void;
  data: Project[];
}

const ProjectSort: FC<ProjectSortProps> = ({ onSortChange, data }) => {
  const [sortValue, setSortValue] = useState<string>("startDateAsc");

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

  useEffect(() => {
    handleSortChange(sortValue)
  }, [])

  const handleSortChange = (value: string) => {
    setSortValue(value);
    const sortFunction = sortMethods[value];
    const sortedData = sortFunction ? [...data].sort(sortFunction) : data;
    onSortChange(sortedData);
  };

  return (
    <>
      <label className="mr-3">Sort By</label>
      <Select
        className="text-black min-w-52 bg-secondary"
        defaultValue=""
        value={sortValue} 
        onChange={(e) => {
          handleSortChange(e.target.value);
        }}
      >
        <MenuItem value="" disabled>
          Choose A Sort Value
        </MenuItem>
        <MenuItem value="Name">Name</MenuItem>
        <MenuItem value="Location">Location</MenuItem>
        <MenuItem value="startDateAsc">Soonest First</MenuItem>
        <MenuItem value="startDateDesc">Latest First</MenuItem>
        <MenuItem value="endDateAsc">Soonest End Date First</MenuItem>
        <MenuItem value="endDateDesc">Latest End Date First</MenuItem>
      </Select>
    </>
  );
};

export default ProjectSort;
