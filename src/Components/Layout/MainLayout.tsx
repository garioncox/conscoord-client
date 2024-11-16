import { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../../css_modules/mainLayout.module.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/Functions/Queries/QueryClient";

const MainLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex grow flex-col h-dvh">
        <div className="shadow shadow-primary z-0">
          <Navbar />
        </div>
        <div className="flex flex-row w-full h-full z-1 bg-faint">
          <div className="bg-slate-200 hidden lg:inline shadow-md shadow-slate-400">
            <Sidebar />
          </div>
          <main className="w-full text-primary flex grow justify-center my-5 mx-20">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  );
};

export default MainLayout;
