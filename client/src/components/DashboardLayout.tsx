// layout/DashboardLayout.tsx

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import type { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({children} : DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* HEADER AT THE TOP */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
