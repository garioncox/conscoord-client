import GDateInput from "./Generics/gDateInput";
import GNumberInput from "./Generics/gNumberInput";
import { useGNumberInput } from "./Generics/gNumberInputController";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import { TableCell, TableRow,  } from "./ui/table";

export function AddShift() {
  const location = useGTextInput("", (v) => v.length === 0 ? "Location" : "");
  const startDate = useGTextInput("", (v) => v.length === 0 ? "Start Date" : "");
  const endDate = useGTextInput("", (v) => v.length === 0 ? "End Date" : "");
  const description = useGTextInput("", (v) => v.length === 0 ? "Description" : "");
  const reqEmp = useGNumberInput(0, () => "Number of Employees");

  return (
    <TableRow>
    <TableCell>
      <div className="">
        <GTextInput control={location} />
      </div>
    </TableCell>
    <TableCell>
      <div>
        <GDateInput control={startDate} />
      </div>
    </TableCell>
    <TableCell>
      <div>
        <GDateInput control={endDate} />
      </div>
    </TableCell>
    <TableCell>
      <div>
        <GTextInput control={description} />
      </div>
    </TableCell>
    <TableCell>
      <GNumberInput control={reqEmp} />
    </TableCell>
    <TableCell>ACTIVE</TableCell>
  </TableRow>
  )
}