import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { useAllEmployees, useEmployeeEditMutation } from "@/Functions/Queries/EmployeeQueries";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

export const UserInfo = () => {
    const editEmployeeMutation = useEmployeeEditMutation();
    const { data: AllEmployees } = useAllEmployees();

    const [Employees, setEmployees] = useState<Employee[]>();
    const [Employee, setEmployee] = useState<Employee>();
    const [Editing, setEditing] = useState(false);

    const [EmployeeName, setEmployeeName] = useState("");
    const [EmployeeEmail, setEmployeeEmail] = useState("");
    const [EmployeePhoneNumber, setEmployeePhoneNumber] = useState("");
    const [EmployeeRoleId, setEmployeeRoleId] = useState(0);
    const [EmployeeCompanyId, setEmployeeCompanyId] = useState(0);

    const [EmployeeView, setEmployeeView] = useState(false);

    useEffect(() => {
        PopulateEmployees();
    }, [])

    async function PopulateEmployees() {
        setEmployees(await AllEmployees)
    }

    function EditEmployee() {
        if (Employee === undefined) return;

        const employee = {
            id: Employee.id,
            name: EmployeeName,
            email: EmployeeEmail,
            phonenumber: EmployeePhoneNumber,
            roleid: EmployeeRoleId,
            companyid: EmployeeCompanyId
        }

        editEmployeeMutation.mutate(employee);
        setEditing(false);
    }

    const list = (
        (Employees !== undefined) ?
            <div>
                {Employees.map((e) => (
                    <div key={e.id} className="flex flex-col border border-black rounded-lg p-4" onClick={() => {
                        setEmployee(e)
                        setEmployeeView(true)
                    }}>
                        <p>{e.name}</p>
                    </div>
                ))}
            </div> :
            <p> please wait as the users load</p>)


    const content = ((Employee !== undefined && EmployeeView) ?
        <div>
            <div className="flex flex-col border border-black rounded-lg p-4">
                <div className="flex flex-col pb-4">
                    <div>
                        {Editing ?
                            (
                                <>
                                    <input className="text-black mb-4 border border-black rounded-lg p-4"
                                        value={EmployeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                    />

                                    <input className="text-black mb-4 border border-black rounded-lg p-4"
                                        value={EmployeeEmail}
                                        onChange={(e) => setEmployeeEmail(e.target.value)}
                                    />
                                    <input className="text-black mb-4 border border-black rounded-lg p-4"
                                        value={EmployeePhoneNumber}
                                        onChange={(e) => setEmployeePhoneNumber(e.target.value)}
                                    />
                                    <input className="text-black mb-4 border border-black rounded-lg p-4"
                                        type="number"
                                        value={EmployeeRoleId}
                                        onChange={(e) => setEmployeeRoleId(parseInt(e.target.value))}
                                    />
                                    <input className="text-black mb-4 border border-black rounded-lg p-4"
                                        type="number"
                                        value={EmployeeCompanyId}
                                        onChange={(e) => setEmployeeCompanyId(parseInt(e.target.value))}
                                    />
                                </>
                            ) :
                            (
                                <>
                                    <p>{Employee.name}</p>
                                    <p>{Employee.email}</p>
                                    <p>{Employee.phonenumber}</p>
                                    <p>{Employee.roleid}</p>
                                    <p>{Employee.companyid}</p>
                                </>
                            )}
                    </div>
                    <div>
                        <button className="flex justify-center" onClick={() => {
                            setEditing(true)
                            setEmployeeName(Employee.name)
                            setEmployeeEmail(Employee.email)
                            setEmployeePhoneNumber(Employee.phonenumber)
                            setEmployeeRoleId(Employee.roleid)
                            setEmployeeCompanyId(Employee.companyid)
                        }}> <Edit /> </button>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col grid grid-cols-2 gap-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                            setEmployeeView(false);
                            setEditing(false);
                        }}> Back </button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                            EditEmployee();
                        }}> Save </button>
                    </div>
                </div>
            </div>
        </div> :
        <></>)

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex">
                {list}
            </div>
            <div className="flex">
                {content}
            </div>
        </div>
    )
}