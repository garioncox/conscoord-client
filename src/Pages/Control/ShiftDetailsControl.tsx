import { useGTextInput } from "@/Components/Generics/control/gTextInputController";
import { useShiftsFulfilledUtils } from "@/Components/ShiftsFulfilledHook";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useEmailRequests } from "@/Functions/EmailRequests";
import {
  useLoggedInEmployee,
  useEmployeesByShiftId,
} from "@/Functions/Queries/EmployeeQueries";
import {
  useEmpShiftMutation,
  useEmpShiftsForLoggedInUser,
} from "@/Functions/Queries/EmployeeShiftQueries";
import {
  useArchiveShiftMutation,
  useShiftById,
} from "@/Functions/Queries/ShiftQueries";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export const useShiftDetailsControl = (id: number) => {
  const {
    shiftFractionString,
    shiftFractionStyles,
    shiftsAvailable,
    shiftsClaimed,
  } = useShiftsFulfilledUtils();
  const archiveShiftMutation = useArchiveShiftMutation();
  const empShiftMutation = useEmpShiftMutation();
  const { sendEmail } = useEmailRequests();

  const { data: loggedInEmployee } = useLoggedInEmployee();
  const { data: claimedShifts, isLoading: isClaimedShiftsLoading } =
    useEmpShiftsForLoggedInUser();
  const { data: shiftFromParam, isLoading: isShiftFromParamLoading } =
    useShiftById(id);
  const { data: signedUpEmployees } = useEmployeesByShiftId(id);

  const noteControl = useGTextInput("", () => "");
  const isLoading = isClaimedShiftsLoading || isShiftFromParamLoading;

  const [currentEmpShift, setCurrentEmpShift] = useState<
    EmployeeShift | undefined
  >(undefined);
  const [loggedStartTime, setLoggedStartTime] = useState<Dayjs | null>(null);
  const [loggedEndTime, setLoggedEndTime] = useState<Dayjs | null>(null);
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [isNotWorkedModalOpen, setNotWorkedModalOpen] = useState(false);
  const toggleShiftNotWorkedModal = () =>
    setNotWorkedModalOpen(!isNotWorkedModalOpen);
  const [confirmedNotWorked, setConfirmedNotWorked] = useState(
    currentEmpShift ? currentEmpShift.didNotWork : false
  );
  const [isCanceledModalOpen, setCanceledModalOpen] = useState(false);
  const toggleShiftCanceledModal = () =>
    setCanceledModalOpen(!isCanceledModalOpen);
  const [confirmCanceled, setConfirmCanceled] = useState(
    currentEmpShift ? currentEmpShift.reportedCanceled : false
  );

  const getEmployeesByShiftId = useEmployeesByShiftId(
    Number(shiftFromParam ? shiftFromParam.id : undefined)
  );

  const archiveShift = async () => {
    if (!shiftFromParam) {
      return;
    }

    archiveShiftMutation.mutate({
      shiftId: shiftFromParam.id,
      makeToast: false,
    });
    const employees = getEmployeesByShiftId.data;
    if (employees) {
      employees.map((e: Employee) => {
        sendEmail({
          email: e.email,
          subject: "Your shift has been canceled",
          messageBody: `The shift at ${shiftFromParam.location} has been canceled. For more information, log in to see the contact info of the person who canceled the shift.`,
        });
      });
    }
  };

  const SaveShiftTimes = () => {
    if (!(currentEmpShift && loggedStartTime && loggedEndTime)) {
      return;
    }

    const startPad =
      String(loggedStartTime.get("minute")).length <= 1 ? "0" : "";
    const endPad = String(loggedEndTime.get("minute")).length <= 1 ? "0" : "";

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      clockInTime: `${loggedStartTime.get(
        "hour"
      )}:${startPad}${loggedStartTime.get("minute")}`,
      clockOutTime: `${loggedEndTime.get("hour")}:${endPad}${loggedEndTime.get(
        "minute"
      )}`,
      didNotWork: currentEmpShift.didNotWork,
      empId: currentEmpShift.empId,
      hasbeeninvoiced: currentEmpShift.hasbeeninvoiced,
      reportedCanceled: currentEmpShift.reportedCanceled,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  };

  const MarkShiftNotWorked = () => {
    if (!(currentEmpShift && loggedStartTime && loggedEndTime)) {
      console.log("conditions were not met");
      return;
    }

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      didNotWork: true,
      clockInTime: null,
      clockOutTime: null,
      empId: currentEmpShift.empId,
      hasbeeninvoiced: currentEmpShift.hasbeeninvoiced,
      notes: noteControl.value ?? "",
      reportedCanceled: currentEmpShift.reportedCanceled,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  };

  const ReportShiftCanceled = () => {
    if (!(currentEmpShift && loggedStartTime && loggedEndTime)) {
      return;
    }

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      didNotWork: true,
      clockInTime: null,
      clockOutTime: null,
      empId: currentEmpShift.empId,
      hasbeeninvoiced: currentEmpShift.hasbeeninvoiced,
      notes: noteControl.value ?? "",
      reportedCanceled: true,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  };

  useEffect(() => {
    if (id && !isClaimedShiftsLoading && !isShiftFromParamLoading) {
      const shift = claimedShifts?.find((cs) => cs.shiftId === Number(id));
      setCurrentEmpShift(shift);

      if (
        !shift ||
        (shift.clockInTime && shift.clockOutTime) ||
        new Date(shiftFromParam!.startTime) > new Date()
      ) {
        setIsFormDisabled(true);
      }
    }
  }, [
    claimedShifts,
    id,
    isClaimedShiftsLoading,
    isShiftFromParamLoading,
    shiftFromParam,
    shiftsAvailable,
    shiftsClaimed,
  ]);

  useEffect(() => {
    if (shiftFromParam && !isShiftFromParamLoading) {
      setLoggedStartTime(
        dayjs(new Date(shiftFromParam!.startTime).toISOString())
      );
      setLoggedEndTime(dayjs(new Date(shiftFromParam!.endTime).toISOString()));
    }
  }, [shiftFromParam, isShiftFromParamLoading]);

  return {
    isLoading,
    loggedInEmployee,
    claimedShifts,
    shiftFromParam,
    signedUpEmployees,
    shiftFractionString,
    shiftFractionStyles,
    shiftsAvailable,
    shiftsClaimed,
    currentEmpShift,
    setCurrentEmpShift,
    loggedStartTime,
    setLoggedStartTime,
    loggedEndTime,
    setLoggedEndTime,
    isFormDisabled,
    setIsFormDisabled,
    isNotWorkedModalOpen,
    isCanceledModalOpen,
    noteControl,
    archiveShift,
    toggleShiftCanceledModal,
    toggleShiftNotWorkedModal,
    confirmedNotWorked,
    setConfirmedNotWorked,
    confirmCanceled,
    setConfirmCanceled,
    SaveShiftTimes,
    MarkShiftNotWorked,
    ReportShiftCanceled,
    setNotWorkedModalOpen
  };
};
