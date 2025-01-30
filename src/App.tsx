import { Routes, Route } from "react-router-dom";
import ProjectList from "./Pages/ProjectList";
import ShiftList from "./Pages/ShiftList";
import EmployeeDetails from "./Pages/EmployeeDetails";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import { Home } from "./Pages/Home";
import MyShifts from "./Pages/MyShifts";
import PermissionLock, {
  ADMIN_ROLE,
  CLIENT_ROLE,
  PSO_ROLE,
} from "./Components/Auth/PermissionLock";
import ProjectShifts from "./Pages/ProjectShifts";
import { ShiftDetails } from "./Pages/ShiftDetails";
import { UserInfo } from "./Components/UserInfo";
import InvoiceCreation from "./Pages/InvoiceCreation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="shift/view/available"
        element={
          <PermissionLock roles={[PSO_ROLE]}>
            <ShiftList />
          </PermissionLock>
        }
      />
      <Route
        path="shift/view/claimed"
        element={
          <PermissionLock roles={[PSO_ROLE]}>
            <MyShifts />
          </PermissionLock>
        }
      />
      <Route
        path="project/view"
        element={
          <PermissionLock roles={[CLIENT_ROLE, PSO_ROLE]}>
            <ProjectList />
          </PermissionLock>
        }
      />
      <Route
        path="project/shifts/:id"
        element={
          <PermissionLock roles={[ADMIN_ROLE, CLIENT_ROLE, PSO_ROLE]}>
            <ProjectShifts />
          </PermissionLock>
        }
      />
      <Route
        path="admin/user/view"
        element={
          <PermissionLock roles={[ADMIN_ROLE]}>
            <UserInfo />
          </PermissionLock>
        }
      />
      <Route
        path="admin/view/employees/:id"
        element={
          <PermissionLock roles={[ADMIN_ROLE]}>
            <EmployeeDetails />
          </PermissionLock>
        }
      />
      <Route
        path="shift/view/details/:id"
        element={
          <PermissionLock roles={[PSO_ROLE, CLIENT_ROLE]}>
            <ShiftDetails />
          </PermissionLock>
        }
      />
      <Route
        path="invoiceCreation"
        element={
          <PermissionLock roles={[CLIENT_ROLE]}>
            <InvoiceCreation />
          </PermissionLock>
        }
      />
      <Route
        path="*"
        element={
          <PermissionLock roles={[PSO_ROLE, CLIENT_ROLE]}>
            <PageNotFound />
          </PermissionLock>
        }
      />
    </Routes>
  );
}

export default App;
