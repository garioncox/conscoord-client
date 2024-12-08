import { Shift } from "@/Data/Interfaces/Shift";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";
import { MenuItem, Select } from "@mui/material";
import { FC, useEffect, useState } from "react";

interface ShiftSortProps {
  onSortChange: (sortedData: Shift[]) => void;
  data: Shift[];
}

const ShiftSort: FC<ShiftSortProps> = ({ onSortChange, data }) => {
  const [sortValue, setSortValue] = useState<string>("startDateAsc");
  const { data: empShifts, isLoading } = useAllEmployeeShifts();

  const sortMethods: { [key: string]: (a: Shift, b: Shift) => number } = {
    officersNeeded: (a, b) => {
      // Calculate employees assigned and needed for shift 'a'
      const employeesAssignedA = empShifts!.filter(
        (es) => es.shiftId == a.id
      ).length;
      const employeesNeededA = a.requestedEmployees - employeesAssignedA;

      // Calculate employees assigned and needed for shift 'b'
      const employeesAssignedB = empShifts!.filter(
        (es) => es.shiftId == b.id
      ).length;
      const employeesNeededB = b.requestedEmployees - employeesAssignedB;

      // Compare based on employees needed
      return employeesNeededB - employeesNeededA;
    },
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

  if (isLoading) return <div>...Loading</div>;

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
        <MenuItem value="officersNeeded">Officers Needed</MenuItem>
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
