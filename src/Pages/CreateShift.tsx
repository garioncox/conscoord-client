import { useState } from "react";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";
import { httpRequest } from "../Functions/HttpRequest";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateShift() {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [requestedEmployees, setRequestedEmployees] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<{
    location?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    requestedEmployees?: string;
  }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateAllInput = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (!startTime) {
      errors.startTime = "Start time is required";
      isValid = false;
    } else if (startTime < today) {
      errors.startTime = "Start time cannot be in the past";
      isValid = false;
    }

    if (!endTime) {
      errors.endTime = "End time is required";
      isValid = false;
    } else if (endTime <= startTime) {
      errors.endTime = "End time must be after start time";
      isValid = false;
    }

    if (requestedEmployees < 1) {
      errors.requestedEmployees = "Requested Officers must be greater than 0";
      isValid = false;
    }
    if (!description) {
      errors.description = "Please add a description";
      isValid = false;
    }
    if (!location) {
      errors.location = "Please add a location";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  async function postShift() {
    setSubmitted(true);
    if (validateAllInput()) {
      const shift: ShiftDTO = {
        StartTime: startTime,
        EndTime: endTime,
        Description: description,
        Location: location,
        RequestedEmployees: requestedEmployees,
        Status: "ACTIVE",
      };
      toast.promise(httpRequest("/api/Shift/add", shift, "POST"), {
        pending: "Creating Shift...",
        success: {
          render() {
            return "Shift Created Successfully";
          },
        },
        error: {
          render({ data }: { data: any }) {
            return data.message || "Error Creating Shift";
          },
        },
      });
      setFormErrors({});
    }
  }

  return (
    <form>
      <h1>Create a New Shift</h1>
      <div className="row">
        <div className="col-md-8 mb-3">
          <label htmlFor="location">Location</label>
          <input
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (submitted && e.target.value) {
                setFormErrors((prev) => ({ ...prev, location: "" }));
              }
            }}
            type="text"
            className={`form-control ${
              submitted && formErrors.location
                ? "is-invalid"
                : location && !formErrors.location && submitted
                ? "is-valid"
                : ""
            }`}
            id="location"
            placeholder="North Side"
            required
          />
          {submitted && formErrors.location && (
            <div className="invalid-feedback">{formErrors.location}</div>
          )}
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="startTime">Start</label>
          <input
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              if (submitted && e.target.value) {
                setFormErrors((prev) => ({ ...prev, startTime: "" }));
              }
            }}
            type="date"
            className={`form-control ${
              submitted && formErrors.startTime
                ? "is-invalid"
                : startTime && !formErrors.startTime && submitted
                ? "is-valid"
                : ""
            }`}
            id="startTime"
            required
          />
          {submitted && formErrors.startTime && (
            <div className="invalid-feedback">{formErrors.startTime}</div>
          )}
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="endTime">End</label>
          <input
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              if (submitted && e.target.value) {
                setFormErrors((prev) => ({ ...prev, endTime: "" }));
              }
            }}
            type="date"
            className={`form-control ${
              submitted && formErrors.endTime
                ? "is-invalid"
                : endTime && !formErrors.endTime && submitted
                ? "is-valid"
                : ""
            }`}
            id="endTime"
            required
          />
          {submitted && formErrors.endTime && (
            <div className="invalid-feedback">{formErrors.endTime}</div>
          )}
        </div>
        <div className="row">
          <div className="col-12 mb-3">
            <label htmlFor="description">Description</label>
            <input
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (submitted && e.target.value) {
                  setFormErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              type="text"
              className={`form-control ${
                submitted && formErrors.description
                  ? "is-invalid"
                  : description && !formErrors.description && submitted
                  ? "is-valid"
                  : ""
              }`}
              id="description"
              placeholder="Traffic Control"
              required
            />
            {submitted && formErrors.description && (
              <div className="invalid-feedback">{formErrors.description}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 mb-3">
            <label htmlFor="requestedEmployees">
              Requested Number of Officers
            </label>
            <input
              value={requestedEmployees}
              onChange={(e) => {
                setRequestedEmployees(Number(e.target.value));
                if (submitted && e.target.value) {
                  setFormErrors((prev) => ({
                    ...prev,
                    requestedEmployees: "",
                  }));
                }
              }}
              type="number"
              className={`form-control ${
                submitted && formErrors.requestedEmployees
                  ? "is-invalid"
                  : requestedEmployees &&
                    !formErrors.requestedEmployees &&
                    submitted
                  ? "is-valid"
                  : ""
              }`}
              id="requestedEmployees"
              placeholder="0"
              required
            />
            {submitted && formErrors.requestedEmployees && (
              <div className="invalid-feedback">
                {formErrors.requestedEmployees}
              </div>
            )}
          </div>
        </div>
      </div>
      <button className="btn btn-primary" type="button" onClick={postShift}>
        Create Shift
      </button>
      <ToastContainer position="bottom-right" />
    </form>
  );
}

export default CreateShift;
