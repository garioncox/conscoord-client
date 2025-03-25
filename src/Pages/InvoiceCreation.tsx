import { Spinner } from "@/Components/Spinner";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import dayjs from "dayjs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useInvoiceCreationControl } from "./Control/InvoiceCreationControl";
import { DateField } from "@mui/x-date-pickers/DateField";
import { SquareArrowOutUpRightIcon } from "lucide-react";

const InvoiceCreation = () => {
  const control = useInvoiceCreationControl();

  if (control.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex grow flex-col xl:max-w-[1800px] xl:flex-row xl:space-x-10 xl:justify-around">
      {/* Filter company */}
      <div className="flex flex-col grow xl:w-[20%] rounded-xl border border-slate-300 shadow-md shadow-slate-400">
        <p className="font-semibold text-2xl bg-slate-200 text-center py-4 rounded-t-xl border-b border-slate-300">
          Companies
        </p>
        <div className="p-4 flex flex-col items-center top-0 z-10 border-b">
          <TextField
            label="Search"
            variant="standard"
            fullWidth
            placeholder="Dynamics Construction Co."
            onChange={(e) => {
              control.setFilterString(e.target.value.toLowerCase());
            }}
          />
        </div>

        <div className="flex flex-col grow pb-4 h-[216px] xl:h-full overflow-y-scroll">
          {control.Companies?.sort((a, b) => a.id - b.id).map((e) => {
            if (
              String(e.id).includes(control.filterString) ||
              e.name.toLowerCase().includes(control.filterString)
            ) {
              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-4 gap-0 p-5 border-b ${
                    control.selectedCompany != null &&
                    control.selectedCompany.id == e.id
                      ? "shadow-inner shadow-slate-500 bg-slate-200"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    control.setCompanyFilter(e);
                  }}
                >
                  <p className="col-span-1">{e.id}</p>
                  <p className="col-span-3 truncate">{e.name}</p>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="space-y-10 flex flex-col grow xl:max-w-[60%] pt-10 xl:pt-0 pb-10 xl:pb-2 xl:overflow-y-scroll px-2">
        <div className="shadow-md rounded-xl shadow-slate-400 border md:min-h-[560px]">
          <div>
            {/* Month / Date Select */}
            <div className="flex flex-row mb-5 py-5 justify-around border-b">
              <div className="ms-10">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={control.monthView}
                    onChange={() => control.toggleMonthView()}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      disabled={
                        control.isGeneratingInvoice ||
                        control.selectedCompany === null
                      }
                      label="Month View"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      disabled={
                        control.isGeneratingInvoice ||
                        control.selectedCompany === null
                      }
                      label="Specific Dates"
                    />
                  </RadioGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={control.includeResidualShifts}
                        onChange={control.handleCheckboxChange}
                      />
                    }
                    disabled={
                      control.isGeneratingInvoice ||
                      control.selectedCompany === null
                    }
                    label="Include Residuals"
                  />
                </FormControl>
              </div>

              <div className="ms-auto me-3 flex flex-row items-center">
                {control.isGeneratingInvoice && (
                  <div className="me-5">
                    <Spinner useText={false} />
                  </div>
                )}
                <button
                  className={`text-white font-semibold p-3 rounded-xl transition-colors duration-150 ${
                    control.isGeneratingInvoice ||
                    control.selectedCompany === null
                      ? "bg-slate-500 opacity-25"
                      : "bg-[#1976d2] hover:bg-[#1565c0]"
                  }`}
                  onClick={() => control.generateInvoice()}
                  disabled={
                    control.isGeneratingInvoice ||
                    control.selectedCompany === null
                  }
                >
                  Generate Invoice
                </button>
              </div>
            </div>

            {control.selectedCompany === null && (
              <div className="flex flex-grow items-center justify-center p-5 lg:min-w-[824px]">
                <p className="text-2xl font-semibold md:min-h-[392px]">
                  Please Select a Company
                </p>
              </div>
            )}

            {/* Calendar View */}
            {control.selectedCompany && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex flex-col items-center p-5 2xl:min-w-[824px]">
                  {control.monthView ? (
                    <div className="flex items-center flex-col md: md:min-h-[392px]">
                      <div className="flex justify-center font-bold mb-5">
                        <button
                          onClick={() => {
                            control.selectPreviousYear();
                          }}
                          className="text-2xl"
                        >
                          <IoChevronBack />
                        </button>
                        <span className="mx-6 text-xl">
                          {control.currentYear}
                        </span>
                        <button
                          onClick={() => {
                            control.selectNextYear();
                          }}
                          className="text-2xl"
                        >
                          <IoChevronForward />
                        </button>
                      </div>
                      <div style={{ transition: "all 0.3s ease" }}>
                        <MonthCalendar
                          defaultValue={dayjs().year(control.currentYear)}
                          value={control.selectedMonth!.year(
                            control.currentYear
                          )}
                          onChange={(value) => {
                            control.handleMonthSelect(value);
                          }}
                          slots={{
                            monthButton: (props) =>
                              control.MonthCalendarBadgeSlots(props),
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row">
                      <div className="flex flex-col">
                        <div>
                          <DateField
                            label="Start Date"
                            value={control.selectedStartDate}
                            onChange={(newValue) => {
                              if (newValue != null) {
                                control.setStartDate(newValue);
                              }
                            }}
                          />
                        </div>
                        <DateCalendar
                          showDaysOutsideCurrentMonth
                          fixedWeekNumber={6}
                          defaultValue={dayjs()}
                          value={control.selectedStartDate}
                          onChange={(value) => {
                            control.setStartDate(value);
                          }}
                          views={["day"]}
                          slots={{
                            day: (props) =>
                              control.DateCalendarBadgeSlots(props),
                          }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <div>
                          <DateField
                            label="End Date"
                            value={control.selectedEndDate}
                            onChange={(newValue) => {
                              if (newValue != null) {
                                control.setEndDate(newValue);
                              }
                            }}
                          />
                        </div>
                        <DateCalendar
                          showDaysOutsideCurrentMonth
                          fixedWeekNumber={6}
                          defaultValue={dayjs()}
                          value={control.selectedEndDate}
                          onChange={(value) => {
                            control.setEndDate(value);
                          }}
                          views={["day"]}
                          slots={{
                            day: (props) => {
                              return control.DateCalendarBadgeSlots(props);
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </LocalizationProvider>
            )}
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="border border-slate-300 shadow-md shadow-slate-400 rounded-xl overflow-x-hidden flex flex-grow flex-col min-h-[250px]">
          <div
            className={`bg-slate-200 min-h-12 flex items-center justify-center ${
              control.selectedCompany ? "" : "opacity-50"
            }`}
          >
            <p className="font-semibold text-xl">Invoice Preview</p>
          </div>

          <div className="flex flex-col grow">
            {control.invoicePreviewData == null ||
            control.invoicePreviewData.length == 0 ? (
              <div className="flex grow justify-center items-center">
                {control.isInvoiceDataLoading ? (
                  <Spinner />
                ) : control.selectedCompany ? (
                  <p>No Data</p>
                ) : null}
              </div>
            ) : (
              control.invoicePreviewData?.map((ipd) =>
                ipd.shiftsByProject.map((sbp) =>
                  sbp.employeesByShift.map((ebs) => (
                    <div
                      key={ebs.employeeId}
                      className={`grid grid-cols-11 gap-0 p-5 border-b border-l-8 
                        ${
                          ebs.hoursWorked > 0
                            ? ebs.is_residual
                              ? "border-l-[#FFC107]"
                              : "border-l-gray-200"
                            : "bg-red-100 border-l-red-400"
                        }`}
                    >
                      <p className="col-span-5">{ebs.employeeName}</p>
                      <p className="col-span-5">{sbp.shiftLocation}</p>
                      <p className="col-span-1">
                        {ebs.hoursWorked == 0
                          ? "--"
                          : `${ebs.hoursWorked.toPrecision(3)} hr`}
                      </p>
                    </div>
                  ))
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* Previous Invoices */}
      <div
        className={`flex flex-col grow xl:w-[20%] rounded-xl border border-slate-300 shadow-md shadow-slate-400 ${
          control.selectedCompany ? "" : "opacity-50"
        }`}
      >
        <p className="font-semibold text-2xl bg-slate-200 text-center py-4 rounded-t-xl border-b border-slate-300">
          Previous Invoices
        </p>
        <div className="p-4 flex flex-col items-center top-0 z-10 border-b">
          <TextField
            label="Search"
            variant="standard"
            fullWidth
            disabled={!control.selectedCompany}
            placeholder="11-21-2025"
            onChange={(e) => {
              control.setFilterString(e.target.value.toLowerCase());
            }}
          />
        </div>

        <div className="flex flex-col grow pb-4 h-[216px] xl:h-full overflow-y-scroll">
          {control.Companies?.map((e) => (
            <div key={e.id} className="grid grid-cols-7 gap-0 p-5 border-b">
              <p className="col-span-3">#55-555</p>
              <p className="col-span-3 truncate">11-21-2025</p>
              <div className="col-span-1 ms-auto">
                <SquareArrowOutUpRightIcon
                  className={`text-blue-500 ${
                    control.selectedCompany
                      ? "hover:text-blue-700 cursor-pointer"
                      : ""
                  } `}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreation;
