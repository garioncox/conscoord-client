import { Company } from "@/Data/Interfaces/Company";
import { useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import { Autocomplete, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // For the arrow icons

const InvoiceCreation = () => {
  const { data: Companies, isLoading: companiesLoading } = useAllCompanies();
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
    return <div>Loading Companies...</div>;
  }

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  return (
    <div className="flex">
      <div className="p-5 mr-10">
        <Autocomplete
          disablePortal
          options={Companies!}
          getOptionLabel={(option) => option.name || String(option.id)}
          sx={{ width: 300 }}
          value={selectedCompany}
          onChange={(_, newSelectedCompany) =>
            setSelectedCompany(newSelectedCompany)
          }
          renderInput={(params) => (
            <TextField {...params} label="Select Company" />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              {option.id}: {option.name}
            </li>
          )}
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col mb-10">
        <label>
          <input
            type="radio"
            name="view"
            value="month"
            defaultChecked
            onClick={() => setMonthView(true)}
          />
          Month View{" "}
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {monthView ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <button
                    onClick={handlePreviousYear}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
                    <IoChevronBack />
                  </button>
                  <span style={{ fontSize: "20px", margin: "0 20px" }}>
                    {currentYear}
                  </span>
                  <button
                    onClick={handleNextYear}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
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
              <div className="flex-row">
                <label>From</label>
                <DateCalendar
                  defaultValue={dayjs()}
                  value={selectedFromDate}
                  onChange={(value) => setSelectedFromDate(value)}
                  views={["day"]}
                />
                <label>To</label>

                <DateCalendar
                  defaultValue={dayjs()}
                  value={selectedToDate}
                  onChange={(value) => setSelectedToDate(value)}
                  views={["day"]}
                />
              </div>
            )}
          </div>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default InvoiceCreation;
