import { useDateUtils } from "@/Components/DateUtils";
import { Company } from "@/Data/Interfaces/Company";
import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import { Badge } from "@mui/material";
import { PickersMonth } from "@mui/x-date-pickers/MonthCalendar/PickersMonth";
import {
  PickersDayProps,
  PickersDay,
} from "@mui/x-date-pickers/PickersDay/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

export const useInvoiceCreationControl = () => {
  const { data: Companies, isLoading: isCompaniesLoading } = useAllCompanies();
  const dateUtils = useDateUtils();

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
  const isLoading = isCompaniesLoading;

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
    props,
    selectedMonth: number,
    monthsCompleted: string[],
    monthsWithError: string[]
  ) => {
    const isSelected =
      dateUtils.monthsTruncated[selectedMonth] == props.children;

    const status = monthsCompleted.includes(props.children)
      ? "success"
      : "warning";

    const visible =
      monthsCompleted.includes(props.children) ||
      monthsWithError.includes(props.children);

    return (
      <Badge
        key={props.children}
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
  };
};
