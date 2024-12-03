import { useEmployeeRequests } from "@/Functions/EmployeeRequests";
import { useAddEmployeeMutation } from "@/Functions/Queries/EmployeeQueries";
import { useGEmailInput, validateEmail } from "./Generics/gEmailInputController";
import { useGPhoneInput, validatePhone } from "./Generics/gPhoneInputController";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import Modal from "./Modal";
import { toast } from "react-toastify";
import GEmailInput from "./Generics/gEmailInput";
import GPhoneInput from "./Generics/gPhoneInput";

interface OtherContactInfoModalProps {
    isModalOpen: boolean;
    toggleModal: () => void;
    AddProject: (id: number) => void;
}

const OtherContactInfoModal: React.FC<OtherContactInfoModalProps> = ({
    isModalOpen,
    toggleModal,
    AddProject,
}) => {
    const name = useGTextInput("", (v) =>
        v.length === 0 ? "Please add a name" : ""
    );

    const addEmployeeMutation = useAddEmployeeMutation();
    const employeeRequests = useEmployeeRequests();

    const email = useGEmailInput("", validateEmail);
    const phonenumber = useGPhoneInput("", validatePhone);

    async function AddEmployee() {
        try {
            const existingEmp = await employeeRequests.getEmployeeByEmail(email.value);

            if (existingEmp) {
                return existingEmp;
            }
        } catch (error) {
            console.error("Error checking if employee exists:", error);
        }

        await addEmployeeMutation.mutateAsync({
            name: name.value,
            email: email.value,
            phonenumber: phonenumber.value,
        });

        return employeeRequests.getEmployeeByEmail(email.value);
    }

    function Validate() {
        if (name.error || email.error || phonenumber.error) {
            toast.error("Please fill in all required fields");
            return false;
        }
    }

    return (
        <Modal isOpen={isModalOpen} onClose={toggleModal}>

            <div className="">
                <div>
                    <h1>Add contact info</h1>
                    <GTextInput control={name} label="Name" />
                    <GEmailInput control={email} label="Email" />
                    <GPhoneInput control={phonenumber} label="Phone Number" />
                </div>
                <div className="flex grow flex-row mt-5">
                    <button
                        onClick={toggleModal}
                        className="ms-auto me-3 p-2 px-4 bg-slate-400 text-white rounded hover:bg-slate-500"
                    >
                        Close
                    </button>
                    <button
                        onClick={async () => {
                            if (!Validate()) return;
                            try {
                                const newEmp = await AddEmployee();

                                if (newEmp) {
                                    await AddProject(newEmp.id);
                                }

                                toggleModal();
                            } catch (error) {
                                toast.error("Error adding employee or creating project");
                            }
                        }}
                        className="p-2 px-4 bg-green-500 hover:bg-green-600 text-black rounded"
                    >
                        Add Contact Info
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default OtherContactInfoModal;