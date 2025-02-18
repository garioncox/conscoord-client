import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { Shift } from "@/Data/Interfaces/Shift";
import { useEmailRequests } from "@/Functions/EmailRequests";
import { useEmployeesByShiftId } from "@/Functions/Queries/EmployeeQueries";
import { useArchiveShiftMutation } from "@/Functions/Queries/ShiftQueries";

interface ClientViewProps {
  signedUpEmployees?: Employee[];
  shift?: Shift;
}

const ClientView = ({ signedUpEmployees, shift }: ClientViewProps) => {
  const archiveShiftMutation = useArchiveShiftMutation();
  const getEmployeesByShiftId = useEmployeesByShiftId(Number(shift?.id));
  const { sendEmail } = useEmailRequests();

  const archiveShift = async() => {
    if (!shift || !shift.id) return;
    archiveShiftMutation.mutate(shift.id);
    const employees = await getEmployeesByShiftId.data;
    if (employees) {
      employees.map(e => {
        sendEmail({
          email: e.email,
          subject: "Your shift has been canceled",
          messageBody: `The shift at ${shift.location} has been canceled, for more information, log in to see the contact info of the person who canceled the shift.`,
        })
      })
    }
  };

  return (
    <div>
      <div className="mt-10 mb-5 text-4xl font-bold">Signed Up Employees:</div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {signedUpEmployees?.map((s, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-300 px-4 py-2">{s.name}</td>
                <td className="border border-gray-300 px-4 py-2">{s.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {s.phonenumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-10 flex justify-end">
          <button
            onClick={archiveShift}
            disabled={shift?.status === "ARCHIVED"}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Cancel Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientView;
