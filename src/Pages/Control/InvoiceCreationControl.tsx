import { useDateUtils } from "@/Components/DateUtils";
import { invoiceCreationDTO } from "@/Data/DTOInterfaces/CreateInvoice";
import { Company } from "@/Data/Interfaces/Company";
import { createInvoice } from "@/Functions/InvoiceRequest";
import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import {
  useAllInvoicesForCompany,
  useInvoicePreviewData,
} from "@/Functions/Queries/InvoicePreviewQueries";
import { useShiftDatesWithError } from "@/Functions/Queries/ShiftQueries";
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
  const [invoiceFilterString, setInvoiceFilterString] = useState("");
  const [monthView, setMonthView] = useState<boolean>(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [selectedStartDate, setSelectedStartDate] =
    useState<dayjs.Dayjs | null>(dayjs().startOf("month"));
  const [selectedEndDate, setSelectedEndDate] = useState<dayjs.Dayjs | null>(
    dayjs()
  );

  const [includeResidualShifts, setIncludeResidualShifts] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] =
    useState<boolean>(false);

  const [invoicePreviewDTO, setInvoicePreviewDTO] =
    useState<invoiceCreationDTO | null>(null);
  const { data: invoicePreviewData, isLoading: isInvoiceDataLoading } =
    useInvoicePreviewData(invoicePreviewDTO);

  const { data: datesWithErrors } = useShiftDatesWithError(selectedCompany?.id);
  const { data: invoices } = useAllInvoicesForCompany(selectedCompany?.id);

  const isLoading = isCompaniesLoading || isUserLoading;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeResidualShifts(event.target.checked);
    getInvoicePreviewData(null, null, null, event.target.checked);
  };

  const DateCalendarBadgeSlots = (props: PickersDayProps<Dayjs>) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      datesWithErrors?.some(
        (d) => dayjs(d).format("YYYY/MM/DD") === dayjs(day).format("YYYY/MM/DD")
      );

    return (
      <Badge
        key={props.day.toString()}
        color="warning"
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

  const MonthCalendarBadgeSlots = (props: PickersMonthProps) => {
    const propMonthLabel =
      typeof props.children === "string" ? props.children : "";

    const monthsWithErrors =
      datesWithErrors
        ?.filter((d) => dayjs(d).year() == currentYear)
        .map((d) => {
          return dateUtils.monthsTruncated[dayjs(d).month()];
        }) ?? [];

    const isSelected =
      dateUtils.monthsTruncated[selectedMonth ? selectedMonth.month() : 0] ==
      props.children;

    const visible = monthsWithErrors.includes(propMonthLabel);

    return (
      <Badge
        key={propMonthLabel}
        color="warning"
        overlap="circular"
        variant="dot"
        invisible={!visible}
      >
        <PickersMonth selected={isSelected} {...props} />
      </Badge>
    );
  };

  const setCompanyFilter = (value: Company) => {
    setSelectedCompany(value);
    getInvoicePreviewData(value.id, null, null, includeResidualShifts);
  };

  const setStartDate = (value: dayjs.Dayjs) => {
    if (!selectedEndDate) {
      return;
    }

    if (value > selectedEndDate) {
      toast.error("Can't select a negative date range");
      return;
    }

    if (
      value.month() > dayjs().month() ||
      (value.month() === dayjs().month() && value.date() > dayjs().date())
    ) {
      toast.error("Can't generate invoices for future dates");
      return;
    }

    setSelectedStartDate(value);
    getInvoicePreviewData(null, value, null, includeResidualShifts);
  };

  const setEndDate = (value: dayjs.Dayjs) => {
    if (!selectedStartDate) {
      return;
    }

    if (value < selectedStartDate) {
      toast.error("Can't select a negative date range");
      return;
    }

    if (
      value.month() > dayjs().month() ||
      (value.month() === dayjs().month() && value.date() > dayjs().date())
    ) {
      toast.error("Can't generate invoices for future dates");
      return;
    }

    setSelectedEndDate(value);
    getInvoicePreviewData(null, null, value, includeResidualShifts);
  };

  const selectPreviousYear = () => {
    setCurrentYear(currentYear - 1);
    getInvoicePreviewData(
      null,
      selectedStartDate!.subtract(1, "year"),
      selectedEndDate!.subtract(1, "year"),
      includeResidualShifts
    );
  };

  const selectNextYear = () => {
    if (currentYear == dayjs().year()) {
      toast.error("Can't generate invoices for future dates");
      return;
    }
    setCurrentYear(currentYear + 1);
    getInvoicePreviewData(
      null,
      selectedStartDate!.add(1, "year"),
      selectedEndDate!.add(1, "year"),
      includeResidualShifts
    );
  };

  const toggleMonthView = () => {
    setMonthView(!monthView);
  };

  const handleMonthSelect = (month: dayjs.Dayjs) => {
    if (
      month.year() > dayjs().year() ||
      (month.year() == dayjs().year() && month.month() > dayjs().month())
    ) {
      toast.error("Cannot generate an invoice for future dates");
      return;
    }

    const startDate = month.startOf("month");
    const endDate = dayjs()
      .month(month.month())
      .year(month.year())
      .date(
        month.month() == dayjs().month()
          ? Math.min(month.endOf("month").date(), dayjs().date())
          : month.endOf("month").date()
      );

    setSelectedMonth(month);
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    getInvoicePreviewData(null, startDate, endDate, includeResidualShifts);
  };

  const generateInvoice = async () => {
    if (!checkValuesExist()) {
      toast.error("Company or Dates Not Set");
      return;
    }
    if (invoicePreviewData == null || invoicePreviewData.length == 0) {
      toast.error("Cannot Generate Invoice With No Data");
      return;
    }

    setIsGeneratingInvoice(true);

    await createInvoice(user?.id_token ?? "", {
      companyId: selectedCompany!.id,
      startDate: selectedStartDate!.format("YYYY-MM-DDTHH:mm:ss.SSS"),
      endDate: selectedEndDate!.format("YYYY-MM-DDTHH:mm:ss.SSS"),
      includeResidualShifts,
    });

    setIsGeneratingInvoice(false);
  };

  const getInvoicePreviewData = (
    freshCompany: number | null,
    freshStartDate: dayjs.Dayjs | null,
    freshEndDate: dayjs.Dayjs | null,
    includeAllResidualShifts: boolean | null
  ) => {
    if (!checkValuesExist()) {
      return;
    }

    //changing data triggers the http call
    const data: invoiceCreationDTO = {
      companyId: Number(freshCompany) || selectedCompany!.id,
      startDate:
        freshStartDate?.format("YYYY-MM-DDTHH:mm:ss.SSS") ??
        selectedStartDate!.format("YYYY-MM-DDTHH:mm:ss.SSS"),
      endDate:
        freshEndDate?.format("YYYY-MM-DDTHH:mm:ss.SSS") ??
        selectedEndDate!.format("YYYY-MM-DDTHH:mm:ss.SSS"),
      includeResidualShifts: includeAllResidualShifts,
    };
    setInvoicePreviewDTO(data);
  };

  const checkValuesExist = () => {
    if (isLoading) {
      return false;
    }
    if (!selectedStartDate || !selectedEndDate || !selectedCompany?.id) {
      return false;
    }
    return true;
  };

  return {
    isLoading,
    invoices,
    Companies,
    currentYear,
    DateCalendarBadgeSlots,
    MonthCalendarBadgeSlots,
    filterString,
    invoiceFilterString,
    setCompanyFilter,
    setFilterString,
    setInvoiceFilterString,
    selectedCompany,
    selectedMonth,
    setSelectedMonth,
    selectedStartDate,
    setStartDate,
    selectedEndDate,
    setEndDate,
    selectPreviousYear,
    selectNextYear,
    monthView,
    toggleMonthView,
    handleMonthSelect,
    generateInvoice,
    getInvoicePreviewData,
    invoicePreviewData,
    isInvoiceDataLoading,
    includeResidualShifts,
    handleCheckboxChange,
    isGeneratingInvoice,
  };
};
