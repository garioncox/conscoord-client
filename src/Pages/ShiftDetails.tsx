import { useParams } from "react-router-dom";
import { Spinner } from "@/Components/Spinner";
import { useShiftDetailsControl } from "./Control/ShiftDetailsControl";
import PermissionComponentLock from "@/Components/Auth/PermissionComponentLock";
import { PSO_ROLE } from "@/Components/Auth/PermissionLock";
import { LogTime } from "@/Components/ShiftDetails/LogTime";
import { SignedUpEmployees } from "@/Components/ShiftDetails/SignedUpEmployees";
import { ShiftDetailsCalendar } from "@/Components/ShiftDetails/ShiftDetailsCalendar";
import { ShiftFraction } from "@/Components/ShiftDetails/ShiftFraction";
import {
  DidNotWorkModal,
  ReportCanceledModal,
} from "@/Components/ShiftDetails/ShiftDetailsModals";

export const ShiftDetails = () => {
  const { id } = useParams();
  const control = useShiftDetailsControl(Number(id));

  if (control.isLoading || !control.shiftFromParam) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap">
      <div className="space-y-2 border-gray-300 bg-white w-full p-4 border rounded-md shadow flex flex-wrap m-3">
        {/* Title */}
        <div className="justify-center items-center p-6 md:w-1/2 w-full">
          <h1 className="font-bold text-5xl text-center">
            {control.shiftFromParam.location.toUpperCase()}
          </h1>
        </div>

        {/* Description Box */}
        <div className="w-full md:w-1/2 border rounded-md bg-gray-50 shadow items-center p-6">
          <p className="text-md">
            {control.shiftFromParam.description &&
            control.shiftFromParam.description.length > 0
              ? control.shiftFromParam.description
              : "No Description Provided"}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap justify-center w-full">
  {/* Log Time/ShiftFraction */}
  <div className="flex flex-col w-full md:w-[45%] lg:w-[30%]">
    <PermissionComponentLock roles={[PSO_ROLE]}>
      <div
        className={`justify-center p-4 border rounded-md shadow h-1/2 md:m-3 ${
          !control.currentEmpShift ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <LogTime control={control} />
      </div>
    </PermissionComponentLock>

    {/* Shift Fraction */}
    <div className="flex items-center justify-center p-4 border rounded-md shadow h-1/2 flex-col m-3">
      <ShiftFraction control={control} />
    </div>
  </div>

  {/* Signed Up Employees - Will be pushed to the bottom on small screens */}
  <div className="w-full lg:w-[30%] p-4 border rounded-md shadow m-3 order-last lg:order-none">
    <SignedUpEmployees control={control} />
  </div>

  {/* Calendar */}
  <div className="w-full md:w-[50%] lg:w-[30%] p-4 border rounded-md shadow m-3">
    <ShiftDetailsCalendar control={control} />
  </div>
</div>

      {/* Modals */}
      <DidNotWorkModal control={control} />
      <ReportCanceledModal control={control} />
    </div>
  );
};
