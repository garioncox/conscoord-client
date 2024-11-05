import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FulfilledShifts } from "@/Data/Interfaces/FulfilledShift";
import { PaginatedProjectTable } from "@/Components/paginated-table";
import { useShiftOfficerListFunctions } from "./ShiftOfficerListFunctions";
import { useAuth0 } from "@auth0/auth0-react";

const ShiftOfficerList: React.FC = () => {
  const SOLDataFunctions = useShiftOfficerListFunctions();
  const {user} = useAuth0();

  useEffect(() => {
    SOLDataFunctions.populateShifts();
    SOLDataFunctions.populateProjects();
    SOLDataFunctions.populateProjectShifts();
  }, [user?.email]);

  useEffect(() => {
    const fetchFulfilledShifts = async () => {
      const results = await Promise.all(
        SOLDataFunctions.shifts.map((s) => SOLDataFunctions.getFulfilledShifts(s.id))
      );
      const fulfilledMap: FulfilledShifts = {};
      SOLDataFunctions.shifts.forEach((shift, index) => {
        fulfilledMap[shift.id] = results[index];
      });
      SOLDataFunctions.setFulfilledShifts(fulfilledMap);
    };

    fetchFulfilledShifts();
  }, [SOLDataFunctions.shifts]);

 
  return (
    <PaginatedProjectTable
      tableHeaders={["Project"]}
      rows={["name"]}
      data={SOLDataFunctions.projects}
    />
  );
};

export default ShiftOfficerList;
