import GDateInput from "./Generics/gDateInput";
import GNumberInput from "./Generics/gNumberInput";
import { useGNumberInput } from "./Generics/gNumberInputController";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import { Table, TableCell, TableHeader, TableRow } from "./ui/table";

export function AddShift() {
  const location = useGTextInput("", (v) => v.length === 0 ? "Location" : "");
  const startDate = useGTextInput("", (v) => v.length === 0 ? "Start Date" : "");
  const endDate = useGTextInput("", (v) => v.length === 0 ? "End Date" : "");
  const description = useGTextInput("", (v) => v.length === 0 ? "Description" : "");
  const reqEmp = useGNumberInput(0, (v) => "Number of Employees");

  return <div>
    <Table>
      <TableHeader>
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
          <TableCell>
            <button className="btn btn-primary" type="button" onClick={()=>{}}>
              Add Shift
            </button>
            </TableCell>
        </TableRow>
      </TableHeader>
    </Table>
  </div>;
}