import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useCustomToast } from "../Components/Toast";
import { useGTextInput } from "../Components/Generics/gTextInputController";
import GTextInput from "../Components/Generics/gTextInput";
import GPhoneInput from "../Components/Generics/gPhoneInput";
import GEmailInput from "../Components/Generics/gEmailInput";
import { useGEmailInput, validateEmail } from "../Components/Generics/gEmailInputController";
import { useGPhoneInput, validatePhone } from "../Components/Generics/gPhoneInputController";

function AddOfficer() {
  const { addEmployee } = useEmployeeRequests();
  const { createToast } = useCustomToast();

  async function AddOfficer() {
    const myPhone = phoneControl.value.replace(/-/g, "");

    await createToast(addEmployee, {
      name: nameControl.value,
      email: emailControl.value,
      phonenumber: myPhone,

    }, "Adding Employee")

  }

  const nameControl = useGTextInput("", (v) => v.length === 0 ? "Please enter a name" : "");
  const emailControl = useGEmailInput("", validateEmail);
  const phoneControl = useGPhoneInput("", validatePhone);

  return (
    <>
      <tr>
        <td><GTextInput control={nameControl} /></td>
        <td><GPhoneInput control={phoneControl} /></td>
        <td><GEmailInput control={emailControl} /></td>
        <td>
        </td>
        <td>
          <button className="btn btn-primary" onClick={AddOfficer}>Add Employee</button>
        </td>
      </tr>
    </>
  );
}

export default AddOfficer;