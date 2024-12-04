import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { MenuItem, Select } from "@mui/material";
import { FC, useEffect, useState } from "react";

interface ProjectSortProps {
  onSortChange: (sortedData: Employee[]) => void;
  data: Employee[];
}

const EmployeeSort: FC<ProjectSortProps> = ({ onSortChange, data }) => {
  const [sortValue, setSortValue] = useState<string>("startDateAsc");

  const sortMethods: { [key: string]: (a: Employee, b: Employee) => number } = {
    Name: (a, b) => a.name.localeCompare(b.name),
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
        className="text-black min-w-52"
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
      </Select>
    </>
  );
};

export default EmployeeSort;
