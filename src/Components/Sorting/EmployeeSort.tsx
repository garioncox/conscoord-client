import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { FC } from "react";

interface ProjectSortProps {
  onSortChange: (sortedData: Employee[]) => void;
  data: Employee[];
}

const EmployeeSort: FC<ProjectSortProps> = ({ onSortChange, data }) => {
  const sortMethods: { [key: string]: (a: Employee, b: Employee) => number } = {
    Name: (a, b) => a.name.localeCompare(b.name),
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
      </select>
    </>
  );
};

export default EmployeeSort;
