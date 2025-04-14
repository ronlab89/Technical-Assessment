"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { Inbox, Settings } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { useRequestStore } from "@/store/requestStore";
import { useUserStore } from "@/store/usersStore";
import { signOutUser } from "@/lib/auth";

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
