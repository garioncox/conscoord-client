import { Shift } from "@/Data/Interfaces/Shift";
import { MenuItem, Select } from "@mui/material";
import { FC } from "react";

interface ShiftSortProps {
  onSortChange: (sortedData: Shift[]) => void;
  data: Shift[];
}

const ShiftSort: FC<ShiftSortProps> = ({ onSortChange, data }) => {
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

  const handleSortChange = (sortValue: string) => {
    if (!sortValue) return;
    const sortFunction = sortMethods[sortValue];
    const sortedData = sortFunction ? [...data].sort(sortFunction) : data;
    onSortChange(sortedData);
  };

  return (
    <>
      <label className="mr-3">Sort By</label>
      <Select
        className="text-black"
        defaultValue=""
        onChange={(e) => {
          handleSortChange(e.target.value);
        }}
      >
        <MenuItem value="" disabled>
          Choose A Sort Value
        </MenuItem>
        <MenuItem value="Location">Location</MenuItem>
        <MenuItem value="startDateAsc">Start Date Ascending</MenuItem>
        <MenuItem value="startDateDesc">Start Date Descending</MenuItem>
        <MenuItem value="endDateAsc">End Date Ascending</MenuItem>
        <MenuItem value="endDateDesc">End Date Descending</MenuItem>
      </Select>
    </>
  );
};

export default ShiftSort;
