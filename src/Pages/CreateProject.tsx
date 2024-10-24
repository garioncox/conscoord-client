import { useState } from "react";
import { ProjectDTO } from "../Data/DTOInterfaces/ProjectDTO";
import { FormatDate } from "../Functions/FormatDates";
import { useProjectRequests } from "../Functions/ProjectRequests";
import { useCustomToast } from "../Components/Toast";
import { ToastContainer } from "react-toastify";

const CreateProject = () => {
  const { addProject } = useProjectRequests();
  const { createToast } = useCustomToast();
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
  }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateAllInput = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (!startDate) {
      errors.startTime = "Start time is required";
      isValid = false;
    } else if (startDate < today) {
      errors.startTime = "Start time cannot be in the past";
      isValid = false;
    }
    if (!title) {
      errors.title = "Project title is required";
      isValid = false;
    }
    if (!endDate) {
      errors.endDate = "End date is required";
      isValid = false;
    }
    if (endDate <= startDate) {
      errors.endDate = "End date must be after start date";
      isValid = false;
    }
    if (!location) {
      errors.location = "Location is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  async function postProject() {
    setSubmitted(true);

    if (validateAllInput()) {
      const project: ProjectDTO = {
        name: title,
        location: location,
        startDate: FormatDate(startDate),
        endDate: FormatDate(endDate),
      };
      createToast(addProject, project, "Creating Project");

      setTitle("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setFormErrors({});
      setSubmitted(false);
    }
  }

  const content = (
    <>
      <form>
        <h1>Create a New Project</h1>
        <div className="row">
          <div className="col-md-8 mb-3">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className={`form-control ${
                submitted && formErrors.title
                  ? "is-invalid"
                  : title && !formErrors.title && submitted
                  ? "is-valid"
                  : ""
              }`}
              id="title"
              placeholder="I-15, Mile Marker: 223, Expansion"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value) {
                  setFormErrors((prev) => ({ ...prev, title: "" }));
                }
              }}
              required
            />
            {submitted && formErrors.title && (
              <div className="invalid-feedback">{formErrors.title}</div>
            )}
          </div>
          <div className="col-md-2 mb-3">
            <label htmlFor="startDate">Start</label>
            <input
              type="date"
              className={`form-control ${
                submitted && formErrors.startDate
                  ? "is-invalid"
                  : startDate && !formErrors.startDate && submitted
                  ? "is-valid"
                  : ""
              }`}
              id="startDate"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value) {
                  setFormErrors((prev) => ({ ...prev, startDate: "" }));
                }
              }}
              required
            />
            {submitted && formErrors.startDate && (
              <div className="invalid-feedback">{formErrors.startDate}</div>
            )}
          </div>
          <div className="col-md-2 mb-3">
            <label htmlFor="endDate">End</label>
            <input
              type="date"
              className={`form-control ${
                submitted && formErrors.endDate
                  ? "is-invalid"
                  : endDate && !formErrors.endDate && submitted
                  ? "is-valid"
                  : ""
              }`}
              id="endDate"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (e.target.value) {
                  setFormErrors((prev) => ({ ...prev, endDate: "" }));
                }
              }}
              required
            />
            {submitted && formErrors.endDate && (
              <div className="invalid-feedback">{formErrors.endDate}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-3">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              className={`form-control ${
                submitted && formErrors.location
                  ? "is-invalid"
                  : location && !formErrors.location && submitted
                  ? "is-valid"
                  : ""
              }`}
              id="location"
              placeholder="Check in at Latitude: -3.59790, Longitude: -79.55949, or I-15 Mile Marker 223"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (e.target.value) {
                  setFormErrors((prev) => ({ ...prev, location: "" }));
                }
              }}
              required
            />
            {submitted && formErrors.location && (
              <div className="invalid-feedback">{formErrors.location}</div>
            )}
          </div>
        </div>
        <button className="btn btn-primary" type="button" onClick={postProject}>
          Create Project
        </button>
        <ToastContainer />
      </form>
    </>
  );

  return <div>{content}</div>;
};

export default CreateProject;
