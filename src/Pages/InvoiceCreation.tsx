import { Spinner } from "@/Components/Spinner";
import {
  Badge,
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
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // For the arrow icons
import { useInvoiceCreationControl } from "./Control/InvoiceCreationControl";

const InvoiceCreation = () => {
  /////////////////////////////////

  const daysWithData = [1, 2, 3, 4, 6, 10, 20, 28];
  const datesWithError = [3, 4, 6, 20];
  const monthsCompleted = ["Jan", "Feb", "Mar"];
  const monthsWithError = ["Jun", "Nov", "Dec"];

  /////////////////////////////////

  const control = useInvoiceCreationControl();

  if (control.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-10 flex grow flex-col xl:max-w-[1300px] xl:flex-row xl:space-x-10 xl:justify-around">
      {/* Filter company */}
      <div className="flex flex-col grow xl:max-w-[25%] rounded-xl border border-slate-300 shadow-md shadow-slate-400">
        <div className="p-4 flex flex-row items-center rounded-t-xl top-0 bg-slate-200 z-10">
          <TextField
            label="Filter"
            variant="standard"
            fullWidth
            onChange={(e) =>
              control.setFilterString(e.target.value.toLowerCase())
            }
          />
        </div>

        <div className="flex flex-col grow pb-4 overflow-x-scroll">
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
                    control.setSelectedCompany(e);
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

      <div className="space-y-10 flex flex-col grow xl:max-w-[60%]">
        <div className="shadow-md rounded-xl shadow-slate-400 border">
          <div>
            {/* Month / Date Select */}
            <div className="flex flex-row mb-5 py-5 justify-around border-b">
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
                    label="Month View"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Specific Dates"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* Calendar View */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col items-center p-5">
                {control.monthView ? (
                  <div>
                    <div className="flex justify-center font-bold mb-5">
                      <button
                        onClick={control.selectPreviousYear}
                        className="text-2xl"
                      >
                        <IoChevronBack />
                      </button>
                      <span className="mx-6 text-xl">
                        {control.currentYear}
                      </span>
                      <button
                        onClick={control.selectNextYear}
                        className="text-2xl"
                      >
                        <IoChevronForward />
                      </button>
                    </div>
                    <div style={{ transition: "all 0.3s ease" }}>
                      <MonthCalendar
                        defaultValue={dayjs().year(control.currentYear)}
                        value={control.selectedMonth!.year(control.currentYear)}
                        onChange={(value) => {
                          control.setSelectedMonth(value);
                        }}
                        slots={{
                          monthButton: (props) =>
                            control.MonthCalendarBadgeSlots(
                              props,
                              control.selectedMonth
                                ? control.selectedMonth.month()
                                : 0,
                              monthsCompleted,
                              monthsWithError
                            ),
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    <div className="flex flex-col">
                      <label className="font-bold underline text-xl">
                        Start
                      </label>
                      <DateCalendar
                        showDaysOutsideCurrentMonth
                        fixedWeekNumber={6}
                        defaultValue={dayjs()}
                        value={control.selectedStartDate}
                        onChange={(value) =>
                          control.setSelectedStartDate(value)
                        }
                        views={["day"]}
                        slots={{
                          day: (props) =>
                            control.DateCalendarBadgeSlots(
                              props,
                              daysWithData,
                              datesWithError
                            ),
                        }}
                        slotProps={{
                          day: {
                            highlightedDays: daysWithData,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          } as any,
                        }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold underline text-xl">End</label>
                      <DateCalendar
                        defaultValue={dayjs()}
                        value={control.selectedEndDate}
                        onChange={(value) => control.setSelectedEndDate(value)}
                        views={["day"]}
                        slots={{
                          day: (props) =>
                            control.DateCalendarBadgeSlots(
                              props,
                              daysWithData,
                              datesWithError
                            ),
                        }}
                        slotProps={{
                          day: {
                            highlightedDays: daysWithData,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          } as any,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </LocalizationProvider>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="border border-slate-300 shadow-md shadow-slate-400 rounded-xl overflow-x-hidden">
          <div className="flex flex-col grow pb-4 overflow-x-scroll">
            {control.Companies?.map((e1) => {
              return control.Companies?.map((e) => {
                return (
                  <div
                    key={e.id}
                    className={`grid grid-cols-11 gap-0 p-5 border-b border-l-8 
                      ${
                        e.id % 2 == 0
                          ? "border-l-red-300"
                          : e.id === 1
                          ? "border-l-yellow-300"
                          : "border-l-slate-50"
                      }`}
                  >
                    <p className="col-span-5">Surname Firstname</p>
                    <p className="col-span-5">Intersection at Main & Vine</p>
                    <p className="col-span-1">23 hr</p>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreation;
