"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Inbox, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "./Loader";
import { signOutUser } from "@/lib/auth";
import { useRequestStore } from "@/store/requestStore";
import { useUserStore } from "@/store/usersStore";

// Menu items.
const items = [
  {
    title: "Pedidos",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const router = useRouter();
  const resetSession = useSessionStore((state) => state.resetSession);
  const resetRequest = useRequestStore((state) => state.resetRequest);
  const resetUser = useUserStore((state) => state.resetUser);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-md text-semibold">
              Prueba tecnica
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="mt-10">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          <Button
            type="button"
            onClick={() =>
              signOutUser(
                setLoading,
                router,
                resetSession,
                resetRequest,
                resetUser
              )
            }
            className="w-full mt-0 cursor-pointer"
          >
            Cerrar sesión
          </Button>
        </SidebarFooter>
      </Sidebar>
      {loading ? <Loader type="" text="" /> : null}
    </>
  );
};

export default AppSidebar;
