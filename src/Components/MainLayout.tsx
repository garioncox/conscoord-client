import { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../css_modules/mainLayout.module.css";

const MainLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div className="text-center vh-100">
      <div className="row h-100 mx-0">
        {/*Sidebar*/}
        <div className="col-2 bg-dark text-light py-5 d-flex justify-content-center">
          <Sidebar />
        </div>

        {/*Main layout*/}
        <div className="col-10 px-0">
          <Navbar />
          <div className="m-5">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainLayout;
