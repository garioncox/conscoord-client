import { useDeleteEmpShiftMutation } from "@/Functions/Queries/EmployeeShiftQueries";
import { MenuItem } from "@mui/material";
import Menu from "@mui/material/Menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

function KebabMenu({ shiftId, employeeId }: { shiftId: number, employeeId?: number }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const deleteEmpShiftMutation = useDeleteEmpShiftMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRemoveFromShift = () => {
    if (!employeeId) {
        toast.error("Employee Id Not Found")
      return;
    }

    deleteEmpShiftMutation.mutate({
      shiftId: shiftId,
      employeeId: employeeId,
    });
    setAnchorEl(null);
  };

  return (
    <div>
      <button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <i className="material-icons">
          <EllipsisVerticalIcon className="h-8 w-8 text-gray-600 hover:bg-gray-200 rounded-full p-2 cursor-pointer transition" />
        </i>
      </button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        >
        <MenuItem onClick={handleRemoveFromShift}>Remove From Shift</MenuItem>
      </Menu>
    </div>
  );
}

export default KebabMenu;
