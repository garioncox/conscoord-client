import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Shift } from "@/Data/Interfaces/Shift";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useEmpShiftRequests } from "@/Functions/EmpShiftRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { useEmployeeRequests } from "@/Functions/EmployeeRequests";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { useCustomToast } from "./Toast";

interface TableComponentProps {
    data: Shift[];
}

export function EmployeeShiftTable({
    data,
}: TableComponentProps) {

    const [loggedinUser, setLoggedinUser] = useState<Employee>();

    useEffect(() => {
        const getemployee = async () => {
            if (user === undefined) {
                toast.error("Please login to take a shift");
                return;
            }
            if (user.email === undefined) {
                toast.error("Verify that your email is correct");
                return;
            }
            const employee = await getEmployeeByEmail(user.email);
            setLoggedinUser(employee);
        }
        getemployee();
    }, [data])

    const { addEmployeeShift } = useEmpShiftRequests();
    const { getEmployeeByEmail } = useEmployeeRequests();
    const { createToast} = useCustomToast();
    const { user } = useAuth0();

    const TakeShift = async (id: number) => {
        await createToast(addEmployeeShift, {
            EmployeeId: loggedinUser!.id,
            ShiftId: id
        }, "Taking Shift");
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Requested Employees</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((shift) => (
                        <TableRow key={shift.id}>
                            <TableCell>{shift.location}</TableCell>
                            <TableCell>{shift.startTime}</TableCell>
                            <TableCell>{shift.endTime}</TableCell>
                            <TableCell>{shift.description}</TableCell>
                            <TableCell>{shift.requestedEmployees}</TableCell>
                            <TableCell>{shift.status}</TableCell>
                            <TableCell>
                                <Button onClick={() => TakeShift(shift.id)} variant="outline" size="icon">
                                    <Plus className="h-16 w-16" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
