import { useParams } from "react-router-dom";
import { Spinner } from "@/Components/Spinner";
import { useShiftDetailsControl } from "./Control/ShiftDetailsControl";
import PermissionComponentLock from "@/Components/Auth/PermissionComponentLock";
import { PSO_ROLE } from "@/Components/Auth/PermissionLock";
import { LogTime } from "@/Components/ShiftDetails/LogTime";
import { SignedUpEmployees } from "@/Components/ShiftDetails/SignedUpEmployees";
import { ShiftDetailsCalendar } from "@/Components/ShiftDetails/ShiftDetailsCalendar";
import { ShiftFraction } from "@/Components/ShiftDetails/ShiftFraction";
import { DidNotWorkModal, ReportCanceledModal } from "@/Components/ShiftDetails/ShiftDetailsModals";

export const ShiftDetails = () => {
  const { id } = useParams();
  const control = useShiftDetailsControl(Number(id));

  if (control.isLoading || !control.shiftFromParam) {
    return <Spinner />;
  }

  return (
    <div className=" flex flex-wrap">
      <div className=" space-y-2 border-gray-300  bg-white w-full p-4 border rounded-lg shadow flex flex-wrap">
        {/* Title */}
        <div className="justify-center items-center p-6 w-1/2">
          <h1 className="font-bold text-5xl text-center">
            {control.shiftFromParam.location.toUpperCase()}
          </h1>
        </div>

        {/* Description Box */}
        <div className="w-1/2 border rounded-lg bg-gray-50 shadow items-center p-6">
          <p className="text-lg">{control.shiftFromParam.description ?? "No Description Provided"}</p>
        </div>
      </div>

      {/* Log Time/ShiftFraction */}
      <div className="flex flex-col w-1/3">
        <PermissionComponentLock roles={[PSO_ROLE]}>
          <LogTime id={Number(id)} />
        </PermissionComponentLock>
        <ShiftFraction id={Number(id)}/>
      </div>

      {/* Signed Up Employees */}
      <SignedUpEmployees id={Number(id)} />

      {/* Calendar */}
      <ShiftDetailsCalendar id={Number(id)} />

      <DidNotWorkModal id={Number(id)} />
      <ReportCanceledModal id={Number(id)} />
    </div>
  );
};
