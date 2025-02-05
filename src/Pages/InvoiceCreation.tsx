import { Spinner } from "@/Components/Spinner";
import { Company } from "@/Data/Interfaces/Company";
import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
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
import {
  PickersDayProps,
  PickersDay,
} from "@mui/x-date-pickers/PickersDay/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // For the arrow icons

const InvoiceCreation = () => {
  /////////////////////////////////
  function ServerDay(
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
  ) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0;

    const datesWithError = [3, 4, 6, 20];
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
  }
  const [highlightedDays, setHighlightedDays] = useState([
    1, 2, 3, 4, 6, 10, 20, 28,
  ]);

  /////////////////////////////////
  const { data: Companies, isLoading: companiesLoading } = useAllCompanies();
  const [filterString, setFilterString] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>();
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [selectedFromDate, setSelectedFromDate] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [selectedToDate, setSelectedToDate] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [monthView, setMonthView] = useState<boolean>(true);
  const [currentYear, setCurrentYear] = useState<number>(dayjs().year()); // Track the current year

  if (companiesLoading) {
    return <Spinner />;
  }

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  return (
    <div className="space-y-10">
      {/* Filter company */}
      <div className="flex flex-col rounded-xl border border-slate-300 shadow-md shadow-slate-400">
        <div className="p-4 flex flex-row items-center rounded-t-xl top-0 bg-slate-200 z-10">
          <TextField
            label="Filter"
            variant="standard"
            fullWidth
            onChange={(e) => setFilterString(e.target.value.toLowerCase())}
          />
        </div>

        <div className="flex flex-col grow pb-4 overflow-x-scroll">
          {Companies?.sort((a, b) => a.id - b.id).map((e) => {
            if (
              String(e.id).includes(filterString) ||
              e.name.toLowerCase().includes(filterString)
            ) {
              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-4 gap-0 p-5 border-b ${
                    selectedCompany != null && selectedCompany.id == e.id
                      ? "shadow-inner shadow-slate-500 bg-slate-200"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    setSelectedCompany(e);
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

      <div className="shadow-md rounded-xl shadow-slate-400 border">
        <div>
          {/* Month / Date Select */}
          <div className="flex flex-row mb-5 py-5 justify-around border-b">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={monthView}
                onChange={() => setMonthView(!monthView)}
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
            <div
              style={{
                alignItems: "center",
              }}
              className="flex flex-col px-5"
            >
              {monthView ? (
                <div>
                  <div className="flex items-center">
                    <button onClick={handlePreviousYear} className="text-2xl">
                      <IoChevronBack />
                    </button>
                    <span className="mx-6 text-xl">{currentYear}</span>
                    <button onClick={handleNextYear} className="text-2xl">
                      <IoChevronForward />
                    </button>
                  </div>
                  <div style={{ transition: "all 0.3s ease" }}>
                    <DateCalendar
                      showDaysOutsideCurrentMonth
                      fixedWeekNumber={6}
                      defaultValue={dayjs().year(currentYear)}
                      value={selectedMonth!.year(currentYear)}
                      onChange={(value) => setSelectedMonth(value)}
                      views={["month"]}
                      openTo="month"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <label className="font-bold underline text-xl">Start</label>
                    <DateCalendar
                      showDaysOutsideCurrentMonth
                      fixedWeekNumber={6}
                      defaultValue={dayjs()}
                      value={selectedFromDate}
                      onChange={(value) => setSelectedFromDate(value)}
                      views={["day"]}
                      slots={{
                        day: ServerDay,
                      }}
                      slotProps={{
                        day: {
                          highlightedDays,
                        } as any,
                      }}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold underline text-xl">End</label>
                    <DateCalendar
                      defaultValue={dayjs()}
                      value={selectedToDate}
                      onChange={(value) => setSelectedToDate(value)}
                      views={["day"]}
                      slots={{
                        day: ServerDay,
                      }}
                      slotProps={{
                        day: {
                          highlightedDays,
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

      <div className="border border-slate-300 shadow-md shadow-slate-400 rounded-xl">
        <div className="flex flex-col grow pb-4 overflow-x-scroll">
          {Companies?.sort((a, b) => a.id - b.id).map((e) => {
            if (
              String(e.id).includes(filterString) ||
              e.name.toLowerCase().includes(filterString)
            ) {
              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-4 gap-0 p-5 border-b ${
                    selectedCompany != null && selectedCompany.id == e.id
                      ? "shadow-inner shadow-slate-500 bg-slate-200"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    setSelectedCompany(e);
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
    </div>
  );
};

export default InvoiceCreation;
