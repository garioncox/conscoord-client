import { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../../css_modules/mainLayout.module.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const MainLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex grow flex-col h-dvh">
        <div>
          <Navbar />
        </div>
        <div className="flex flex-row w-full h-full">
          <div className="bg-secondary hidden lg:inline">
            <Sidebar />
          </div>
          <main className="bg-faint w-full text-primary flex grow justify-center mt-5">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  );
};

export default MainLayout;
