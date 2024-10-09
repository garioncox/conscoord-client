import { useState, useEffect } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import {
  archiveShift,
  editShift,
  getAllArchivedShifts,
  getAllShifts,
} from "../Functions/ApiRequests";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";

function ShiftList() {
  const [selected, setSelected] = useState<number>();
  const [selectLocation, setLocation] = useState<string>("");
  const [selectStartTime, setStartTime] = useState<string>("");
  const [selectEndTime, setEndTime] = useState<string>("");
  const [selectDescription, setDescription] = useState<string>("");
  const [selectReqEmployees, setReqEmployees] = useState<number>(-1);
  const [shifts, setShifts] = useState<Shift[]>();

  useEffect(() => {
    populateShifts();
  }, []);

  useEffect(() => {
    const shift = findShift();

    if (shift === undefined) {
      return;
    }

    setLocation(shift.location);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setReqEmployees(shift.requestedEmployees);
    setDescription(shift.description);
  }, [selected]);
  /////////////////// TODO ///////////////////
  // This useEffect should have the function as params
  // but is not able to. Find a way to "findShift" without
  // rendering every cycle

  async function populateShifts() {
    const archived = await getAllArchivedShifts();
    const active = await getAllShifts();
    setShifts([...archived, ...active]);
  }

  function handleEdit(id: number) {
    setSelected(id);
  }

  async function handleArchive(shift: Shift) {
    await archiveShift(shift.id);

    setShifts((prevShifts) =>
      prevShifts?.map((s) => (s.id === shift.id ? shift : s))
    );
  }

  async function saveEdit() {
    const shift = findShift();

    if (shift === undefined) {
      console.log("Error when saving shift: shift not found");
      return;
    }

    const newShift: ShiftDTO = {
      Location: selectLocation,
      StartTime: selectStartTime,
      EndTime: selectEndTime,
      Description: selectDescription,
      RequestedEmployees: selectReqEmployees,
      Status: shift.status,
    };

    await editShift(shift.id, newShift);
    handleEdit(-1);

    await populateShifts();
  }

  function findShift() {
    if (shifts === undefined) {
      return;
    }
    for (let i = 0; i < shifts.length; i++) {
      if (shifts[i].id === selected) {
        return shifts[i];
      }
    }
  }

  function checkSelected(s: Shift) {
    const val =
      s.id === selected ? (
        <tr key={s.id}>
          <td>
            <input
              className="form-control"
              onChange={(e) => setLocation(e.target.value)}
              value={selectLocation}
            />
          </td>
          <td>
            <input
              className="form-control"
              onChange={(e) => setStartTime(e.target.value)}
              value={selectStartTime}
            />
          </td>
          <td>
            <input
              className="form-control"
              onChange={(e) => setEndTime(e.target.value)}
              value={selectEndTime}
            />
          </td>
          <td>
            <input
              className="form-control"
              onChange={(e) => setDescription(e.target.value)}
              value={selectDescription}
            />
          </td>
          <td>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setReqEmployees(Number(e.target.value))}
              value={selectReqEmployees}
            />
          </td>
          <td> {findShift()?.status} </td>
          <td>
            <button onClick={() => saveEdit()} className="btn btn-success">
              Save
            </button>
          </td>
          <td>
            <button onClick={() => handleEdit(-1)} className="btn btn-danger">
              Cancel
            </button>
          </td>
        </tr>
      ) : (
        <tr key={s.id}>
          <td>{s.location}</td>
          <td>{s.startTime}</td>
          <td>{s.endTime}</td>
          <td>{s.description}</td>
          <td>{s.requestedEmployees}</td>
          <td>{s.status} </td>
          <td>
            <button
              onClick={() => handleEdit(s.id)}
              className="btn btn-warning"
            >
              Edit
            </button>
          </td>
          <td>
            <button onClick={() => handleArchive(s)} className="btn btn-danger">
              Delete
            </button>
          </td>
        </tr>
      );
    return val;
  }

  const contents =
    shifts === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Location</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>{shifts.map((s) => checkSelected(s))}</tbody>
      </table>
    );

  return (
    <div>
      <h1 id="shifts"> Shift List</h1>
      {contents}
    </div>
  );
}
export default ShiftList;
