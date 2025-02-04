import { Spinner } from "@/Components/Spinner";
import { Company } from "@/Data/Interfaces/Company";
import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // For the arrow icons

const InvoiceCreation = () => {
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
    <div className="flex flex-row grow justify-center align-middle p-12">
      {/* Filter company */}
      <div className="flex flex-col w-full max-w-96 rounded border-2 border-slate-300 shadow-md shadow-slate-400">
        <div className="p-4 flex flex-row items-center sticky top-0 bg-slate-200 z-10">
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

      <div className="py-5 mx-5 shadow-md rounded-xl shadow-slate-400 border">
        <div>
          {/* Month / Date Select */}
          <div className="flex flex-row mb-5 pb-5 justify-around border-b">
            <label>
              <input
                type="radio"
                name="view"
                value="month"
                defaultChecked
                onClick={() => setMonthView(true)}
              />{" "}
              Month View
            </label>
            <label>
              <input
                type="radio"
                name="view"
                value="dates"
                onClick={() => setMonthView(false)}
              />{" "}
              Specific Dates
            </label>
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
                  <div className="flex items-center mb-10">
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
                      defaultValue={dayjs().year(currentYear)}
                      value={selectedMonth!.year(currentYear)}
                      onChange={(value) => setSelectedMonth(value)}
                      views={["month"]}
                      openTo="month"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-row">
                  <div className="flex flex-col">
                    <label className="font-bold underline text-xl">Start</label>
                    <DateCalendar
                      defaultValue={dayjs()}
                      value={selectedFromDate}
                      onChange={(value) => setSelectedFromDate(value)}
                      views={["day"]}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold underline text-xl">End</label>
                    <DateCalendar
                      defaultValue={dayjs()}
                      value={selectedToDate}
                      onChange={(value) => setSelectedToDate(value)}
                      views={["day"]}
                    />
                  </div>
                </div>
              )}
            </div>
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreation;
