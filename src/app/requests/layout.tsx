import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className={`${poppins.variable}`}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <section className="w-screen max-w-screen h-screen overflow-hidden relative">
          {children}
        </section>
      </SidebarProvider>
    </main>
  );
}
