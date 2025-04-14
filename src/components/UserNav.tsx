"use client";

import { LogOut, Mail, ShieldUser, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/sessionStore";
import { useState } from "react";
import Loader from "./Loader";
import { useRequestStore } from "@/store/requestStore";
import { useUserStore } from "@/store/usersStore";

const UserNav = () => {
  const user = useSessionStore((state) => state.user);
  const profile = useSessionStore((state) => state.profile);
  const resetSession = useSessionStore((state) => state.resetSession);
  const resetRequest = useRequestStore((state) => state.resetRequest);
  const resetUser = useUserStore((state) => state.resetUser);
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const roles = {
    client: "Cliente",
    pm: "Project Manager",
    designer: "Diseñador",
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
                  <AvatarFallback className="rounded-lg">
                    <User />
                  </AvatarFallback>
                </Avatar>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <p className="truncate font-semibold mb-2">
                      {user?.full_name}
                    </p>
                    <p className="truncate text-xs flex flex-col mb-2">
                      <span className="font-medium flex justify-start items-center gap-x-1">
                        <Mail className="w-3.5" /> Email{" "}
                      </span>
                      <span>{user?.email}</span>
                    </p>
                    <p className="truncate text-xs flex flex-col mb-2">
                      <span className="font-medium flex justify-start items-center gap-x-1">
                        <ShieldUser className="w-3.5" /> Perfil{" "}
                      </span>
                      <span>
                        {profile?.role
                          ? roles[profile.role as keyof typeof roles]
                          : "Role not assigned"}
                      </span>
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  signOutUser(
                    setLoading,
                    router,
                    resetSession,
                    resetRequest,
                    resetUser
                  )
                }
              >
                <LogOut />
                <span className="cursor-pointer">Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      {loading ? <Loader type="" text="" /> : null}
    </>
  );
};

export default UserNav;
