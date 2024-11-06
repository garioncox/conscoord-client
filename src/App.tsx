import { Routes, Route } from "react-router-dom";
import CreateShift from "./Pages/CreateShift";
import ProjectList from "./Pages/ProjectList";
import ShiftList from "./Pages/ShiftList";
import ShiftOfficerList from "./Pages/ShiftOfficerList";
import CreateProject from "./Pages/CreateProject";
import EmployeeDetails from "./Pages/EmployeeDetails";
import EmployeeList from "./Pages/EmployeeList";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import { Home } from "./Pages/Home";
import MyShifts from "./Pages/MyShifts/MyShifts";
import PermissionLock, {
  ADMIN_ROLE,
  CLIENT_ROLE,
  PSO_ROLE,
} from "./Components/Auth/PermissionLock";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PermissionLock roles={[PSO_ROLE, CLIENT_ROLE]}>
            <Home />
          </PermissionLock>
        }
      />

      <Route
        path="shift/view"
        element={
          <PermissionLock roles={[CLIENT_ROLE]}>
            <ShiftList />
          </PermissionLock>
        }
      />
      <Route
        path="shift/view/officer"
        element={
          <PermissionLock roles={[PSO_ROLE]}>
            <ShiftOfficerList />
          </PermissionLock>
        }
      />
      <Route
        path="shift/view/shifts"
        element={
          <PermissionLock roles={[PSO_ROLE]}>
            <MyShifts />
          </PermissionLock>
        }
      />
      <Route
        path="project/view"
        element={
          <PermissionLock roles={[CLIENT_ROLE]}>
            <ProjectList />
          </PermissionLock>
        }
      />
      <Route
        path="shift/create"
        element={
          <PermissionLock roles={[CLIENT_ROLE]}>
            <CreateShift />
          </PermissionLock>
        }
      />
      <Route
        path="project/create"
        element={
          <PermissionLock roles={[CLIENT_ROLE]}>
            <CreateProject />
          </PermissionLock>
        }
      />
      <Route
        path="admin/view/employees"
        element={
          <PermissionLock roles={[ADMIN_ROLE]}>
            <EmployeeList />
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
