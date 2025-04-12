import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className={`${geistSans.variable} ${geistMono.variable}`}>
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
