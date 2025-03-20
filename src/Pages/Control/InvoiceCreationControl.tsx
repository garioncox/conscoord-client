import { useDateUtils } from "@/Components/DateUtils";
import { invoiceCreationDTO } from "@/Data/DTOInterfaces/CreateInvoice";
import { Company } from "@/Data/Interfaces/Company";
import { createInvoice } from "@/Functions/InvoiceRequest";
import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import { useInvoicePreviewData } from "@/Functions/Queries/InvoicePreviewQueries";
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
  const [monthView, setMonthView] = useState<boolean>(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [selectedStartDate, setSelectedStartDate] =
    useState<dayjs.Dayjs | null>(dayjs());
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
    if (selectedEndDate && value > selectedEndDate) {
      return;
    }

    setSelectedStartDate(value);
    getInvoicePreviewData(null, value, null, includeResidualShifts);
  };

  const setEndDate = (value: dayjs.Dayjs) => {
    if (selectedStartDate && value < selectedStartDate) {
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
    setSelectedMonth(month);
    setSelectedStartDate(month.startOf("month"));
    setSelectedEndDate(month.endOf("month").subtract(1, "day"));
    getInvoicePreviewData(
      null,
      month.startOf("month"),
      month.endOf("month").subtract(1, "day"),
      includeResidualShifts
    );
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
    freshendDate: dayjs.Dayjs | null,
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
        freshendDate?.format("YYYY-MM-DDTHH:mm:ss.SSS") ??
        selectedEndDate!.format("YYYY-MM-DDTHH:mm:ss.SSS"),
      includeResidualShifts: includeAllResidualShifts
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
    Companies,
    currentYear,
    DateCalendarBadgeSlots,
    MonthCalendarBadgeSlots,
    filterString,
    setCompanyFilter,
    setFilterString,
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
