import { useDateUtils } from "@/Components/DateUtils";
import { Badge } from "@mui/material";
import { PickersMonth } from "@mui/x-date-pickers/MonthCalendar/PickersMonth";
import {
  PickersDayProps,
  PickersDay,
} from "@mui/x-date-pickers/PickersDay/PickersDay";
import { Dayjs } from "dayjs";

export const useInvoiceCreationControl = () => {
  const dateUtils = useDateUtils();

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
  return {
    DateCalendarBadgeSlots,
    MonthCalendarBadgeSlots,
  };
};
