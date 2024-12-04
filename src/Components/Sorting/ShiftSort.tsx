import { Shift } from "@/Data/Interfaces/Shift";
import { MenuItem, Select } from "@mui/material";
import { FC, useEffect, useState } from "react";

interface ShiftSortProps {
  onSortChange: (sortedData: Shift[]) => void;
  data: Shift[];
}

const ShiftSort: FC<ShiftSortProps> = ({ onSortChange, data }) => {
  const [sortValue, setSortValue] = useState<string>("startDateAsc");

  const sortMethods: { [key: string]: (a: Shift, b: Shift) => number } = {
    startDateAsc: (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    startDateDesc: (a, b) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    endDateAsc: (a, b) =>
      new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
    endDateDesc: (a, b) =>
      new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    Location: (a, b) => a.location.localeCompare(b.location),
  };

  useEffect(() => {
    handleSortChange(sortValue);
  }, []);

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
        <MenuItem value="startDateAsc">Soonest First</MenuItem>
        <MenuItem value="startDateDesc">Latest First</MenuItem>
        <MenuItem value="Location">Location</MenuItem>
        <MenuItem value="endDateAsc">End Date Ascending</MenuItem>
        <MenuItem value="endDateDesc">End Date Descending</MenuItem>
      </Select>
    </>
  );
};

export default ShiftSort;
