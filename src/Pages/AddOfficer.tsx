import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useCustomToast } from "../Components/Toast";
import { useGTextInput } from "../Components/Generics/gTextInputController";
import GTextInput from "../Components/Generics/gTextInput";
import GPhoneInput from "../Components/Generics/gPhoneInput";
import GEmailInput from "../Components/Generics/gEmailInput";
import { useGEmailInput } from "../Components/Generics/gEmailInputController";
import { useGPhoneInput } from "../Components/Generics/gPhoneInputController";


function AddOfficer() {
  const { addEmployee } = useEmployeeRequests();
  const {createToast} = useCustomToast();

  //chat gave these regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(?:\+|00)?\d{10}$/;

  async function AddOfficer() {
      const myPhone = phoneControl.value.replace(/-/g, "");

      await createToast(addEmployee,{
        name: nameControl.value,
        email: emailControl.value,
        phonenumber: myPhone,

      }, "Adding Employee")
  }

  const nameControl = useGTextInput("", (v) => v.length === 0 ? "Please enter a name" : "");
  const emailControl = useGEmailInput("", () => !emailRegex.test(emailControl.value) ? "Please enter an email" : "");  
  const phoneControl = useGPhoneInput("", () => !phoneRegex.test(phoneControl.value.replace(/-/g, "")) ? "Please enter a phone number" : "");

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