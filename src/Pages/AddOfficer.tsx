import { useState } from "react";
import { httpRequest } from "../Functions/HttpRequest";
import { EmployeeDTO } from "../Data/DTOInterfaces/EmployeeDTOInterface";

function AddOfficer() {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  //chat gave these regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(?:\+|00)?\d{10}$/;

  function validateForm() {
    const errors: { [key: string]: string } = {};

    let isvalid = true;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid Email Format";
      isvalid = false;
    }
    if (!phoneRegex.test(phone.replace(/-/g, ""))) {
      isvalid = false;
      errors.phone = "Invalid Phone";
    }
    if (name.length === 0) {
      isvalid = false;
      errors.name = "Name Is Required";
    }
    setFormErrors(errors);
    return isvalid;
  }

  async function PostEmployee() {
    if (validateForm()) {
      const myPhone = phone.replace(/-/g, "");

      const employee: EmployeeDTO = {
        name: name,
        email: email,
        phonenumber: myPhone,
      };
      setFormErrors({});
      await httpRequest("/api/Employee/add", employee, "POST");
    }
  }

  function formatPhoneNumber(value: string) {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "");
    let formattedValue = "";

    if (digits.length > 0) {
      formattedValue += digits.substring(0, 3); // Area code
    }
    if (digits.length > 3) {
      formattedValue += "-" + digits.substring(3, 6); // First 3 digits
    }
    if (digits.length > 6) {
      formattedValue += "-" + digits.substring(6, 10); // Last 4 digits
    }

    return formattedValue;
  }

  return (
    <>
      <h3>Add Officer</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          PostEmployee();
        }}
      >
        <div className="container">
          <div className="row">
            <label className="m-2">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className={`form-control ${
                  formErrors.name ? "is-invalid" : ""
                }`}
                id="name"
                placeholder="First Last"
              />
              {formErrors.name && (
                <div className="invalid-feedback">{formErrors.name}</div>
              )}
            </label>

            <label className="m-2">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={`form-control ${
                  formErrors.email ? "is-invalid" : ""
                }`}
                id="email"
                placeholder="example@email.com"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
              {formErrors.email && (
                <div className="invalid-feedback">{formErrors.email}</div>
              )}
            </label>
          </div>

          <div className="row">
            <div className="col-6">
              <label className="m-2">
                Phone
                <input
                  value={phone}
                  onChange={(e) => {
                    const formattedPhone = formatPhoneNumber(e.target.value);
                    setPhone(formattedPhone);
                  }}
                  type="text"
                  className={`form-control ${
                    formErrors.phone ? "is-invalid" : ""
                  }`}
                  id="phone"
                  placeholder="555-555-5555"
                />
                {formErrors.phone && (
                  <div className="invalid-feedback">{formErrors.phone}</div>
                )}
                <div className="form-text">
                  We'll never share your phone with anyone else.
                </div>
              </label>
            </div>

            <div className="col-6">
              <label className="m-2">
                Role
                <select className="form-select">
                  <option>Role 1</option>
                  <option>Role 2</option>
                  <option>Role 3</option>
                </select>
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button type="submit" className="btn btn-primary">
                Add Officer
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddOfficer;
