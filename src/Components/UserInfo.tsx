import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { getAllEmployees, useEmployeeRequests } from "@/Functions/EmployeeRequests"
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

export const UserInfo = () => {
    const AllEmployees = getAllEmployees();
    const { editEmployee } = useEmployeeRequests();

    const [Employees, setEmployees] = useState<Employee[]>();
    const [Employee, setEmployee] = useState<Employee>();

    const [EmployeeView, setEmployeeView] = useState(false);

    useEffect(() => {
        PopulateEmployees();
    }, [])

    async function PopulateEmployees() {
        setEmployees(await AllEmployees)
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
                        <p>{Employee.name}</p>
                        <p>{Employee.email}</p>
                        <p>{Employee.phonenumber}</p>
                        <p>{Employee.roleid}</p>
                        <p>{Employee.companyid}</p>
                    </div>
                    <div>
                        <button className="flex justify-center"><Edit /></button>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col grid grid-cols-2 gap-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                            setEmployeeView(false)
                        }}> Back </button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                            editEmployee(Employee)
                        }}> Edit </button>
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