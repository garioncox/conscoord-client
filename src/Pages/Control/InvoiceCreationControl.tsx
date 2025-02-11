import { useDateUtils } from "@/Components/DateUtils";
import { Company } from "@/Data/Interfaces/Company";
import { createInvoice } from "@/Functions/InvoiceRequest";
import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import { Badge } from "@mui/material";
import {
  PickersMonth,
  PickersMonthProps,
} from "@mui/x-date-pickers/MonthCalendar/PickersMonth";
import {
  PickersDayProps,
  PickersDay,
} from "@mui/x-date-pickers/PickersDay/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { toast } from "react-toastify";

export const useInvoiceCreationControl = () => {
  const { data: Companies, isLoading: isCompaniesLoading } = useAllCompanies();
  const dateUtils = useDateUtils();
  const { user, isLoading: isUserLoading } = useAuth();

  const [currentYear, setCurrentYear] = useState<number>(dayjs().year());
  const [filterString, setFilterString] = useState("");
  const [monthView, setMonthView] = useState<boolean>(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>();
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [selectedStartDate, setSelectedStartDate] =
    useState<dayjs.Dayjs | null>(dayjs());
  const [selectedEndDate, setSelectedEndDate] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const isLoading = isCompaniesLoading || isUserLoading;

  const DateCalendarBadgeSlots = (
    props: PickersDayProps<Dayjs>,
    highlightedDays: number[],
    datesWithError: number[]
  ) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0;

    const status = datesWithError.includes(props.day.date())
      ? "warning"
      : "success";

    return (
      <Badge
        key={props.day.toString()}
        color={status}
        overlap="circular"
        variant="dot"
        invisible={!isSelected}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  const MonthCalendarBadgeSlots = (
    props: PickersMonthProps,
    selectedMonth: number,
    monthsCompleted: string[],
    monthsWithError: string[]
  ) => {
    const monthLabel = typeof props.children === "string" ? props.children : "";

    const isSelected =
      dateUtils.monthsTruncated[selectedMonth] == props.children;

    const status = monthsCompleted.includes(monthLabel) ? "success" : "warning";

    const visible =
      monthsCompleted.includes(monthLabel) ||
      monthsWithError.includes(monthLabel);

    return (
      <Badge
        key={monthLabel}
        color={status}
        overlap="circular"
        variant="dot"
        invisible={!visible}
      >
        <PickersMonth selected={isSelected} {...props} />
      </Badge>
    );
  };

  const selectPreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const selectNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const toggleMonthView = () => {
    setMonthView(!monthView);
  };

  const handleMonthSelect = (month: dayjs.Dayjs) => {
    setSelectedMonth(month);
    setSelectedStartDate(month.startOf("month"));
    setSelectedEndDate(month.endOf("month").subtract(1, "day"));
  };

  const generateInvoice = () => {
    if (isLoading) {
      return;
    }
    if (!selectedStartDate) {
      toast.error("No Start Date Selected");
      return;
    }
    if (!selectedEndDate) {
      toast.error("No End Date Selected");
      return;
    }
    if (!selectedCompany?.id) {
      toast.error("No Company Selected");
      return;
    }

    createInvoice(user?.id_token ?? "", {
      companyId: selectedCompany.id,
      startDate: selectedStartDate.format("YYYY/MM/DD"),
      endDate: selectedEndDate.format("YYYY/MM/DD"),
    });
  };

  return {
    isLoading,
    Companies,
    currentYear,
    DateCalendarBadgeSlots,
    MonthCalendarBadgeSlots,
    filterString,
    setFilterString,
    selectedCompany,
    setSelectedCompany,
    selectedMonth,
    setSelectedMonth,
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
    selectPreviousYear,
    selectNextYear,
    monthView,
    toggleMonthView,
    handleMonthSelect,
    generateInvoice,
  };
};
