import { useState, useEffect } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import { useShiftRequests } from "../Functions/ShiftRequests";
import { useCustomToast } from "../Components/Toast";

function ShiftList() {
  const { getAllArchivedShifts, getAllShifts, archiveShift, editShift } =
    useShiftRequests();
  const [selected, setSelected] = useState<number>();
  const [selectLocation, setLocation] = useState<string>("");
  const [selectStartTime, setStartTime] = useState<string>("");
  const [selectEndTime, setEndTime] = useState<string>("");
  const [selectDescription, setDescription] = useState<string>("");
  const [selectReqEmployees, setReqEmployees] = useState<number>(-1);
  const [shifts, setShifts] = useState<Shift[]>();
  const { createToast } = useCustomToast();

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

  async function populateShifts() {
    const archived = await getAllArchivedShifts();
    const active = await getAllShifts();
    setShifts([...archived, ...active]);
  }

  function handleEdit(id: number) {
    setSelected(id);
  }

  async function handleArchive(shift: Shift) {
    await createToast(archiveShift, shift.id, "Archiving Shift");

    setShifts((prevShifts) =>
      prevShifts?.map((s) => (s.id === shift.id ? shift : s))
    );
  }

  async function saveEdit(s: Shift) {
    if (s === undefined) {
      console.log("Error when saving shift: shift not found");
      return;
    }

    const newShift: Shift = {
      id: s.id,
      location: selectLocation,
      startTime: selectStartTime,
      endTime: selectEndTime,
      description: selectDescription,
      requestedEmployees: selectReqEmployees,
      status: s.status,
    };

    await createToast(editShift, newShift, "Editing Shift");

    handleEdit(-1);

    await populateShifts();
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
          <td> {s.status} </td>
          <td>
            <button onClick={() => saveEdit(s)} className="btn btn-success">
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
              Archive
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
