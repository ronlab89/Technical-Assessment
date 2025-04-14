"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import UserNav from "@/components/UserNav";
import Loader from "@/components/Loader";
import CreateProjectForm from "@/components/CreateProjectForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderKanban } from "lucide-react";
import { columnsRequest } from "@/app/requests/columnsRequest";
import { useSessionStore } from "@/store/sessionStore";
import { useRequestStore } from "@/store/requestStore";
import { useUserStore } from "@/store/usersStore";
import { getAllDesigners } from "@/lib/users";
import { getAllRequests } from "@/lib/request";

const Page = () => {
  const profile = useSessionStore((state) => state.profile);
  const user = useSessionStore((state) => state.user);
  const requests = useRequestStore((state) => state.requests);
  const setRequests = useRequestStore((state) => state.setRequests);
  const setSelectedDesignerId = useRequestStore(
    (state) => state.setSelectedDesignerId
  );
  const setUsers = useUserStore((state) => state.setUsers);
  const [loading, setLoading] = useState<boolean>(false);

  const getRequest = async () => {
    await getAllRequests({
      setLoading,
      setRequests,
      profile: profile?.role,
      sessionId: user?.id,
    });
  };

  const getUsers = async () => {
    await getAllDesigners({ setLoading, setUsers });
  };

  useEffect(() => {
    getRequest();
    if (profile?.role === "pm") getUsers();
  }, []);

  useEffect(() => {
    if (!requests || requests.length === 0) return;

    const assigned = requests
      .filter((project) => project.designer_id !== null)
      .map((project) => ({
        projectId: project.id,
        designerId: project.designer_id,
      }));

    assigned.forEach(({ projectId, designerId }) => {
      setSelectedDesignerId(projectId, designerId);
    });
  }, [requests]);

  return (
    <section className="flex w-full min-h-screen flex-col items-start justify-start relative px-[40px]">
      <article className="absolute top-0 right-[20px]">
        <UserNav />
      </article>
      <article className="container mx-auto py-[100px]">
        {profile?.role === "client" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="submit"
                className="w-fit my-5 cursor-pointer ml-auto"
              >
                Nuevo proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderKanban /> Proyecto
                </DialogTitle>
                <DialogDescription className="font-medium">
                  Completa los campos para crear un nuevo proyecto.
                </DialogDescription>
              </DialogHeader>
              <CreateProjectForm />
            </DialogContent>
          </Dialog>
        )}
        <DataTable columns={columnsRequest} data={requests ?? []} />
      </article>
      {loading ? <Loader type="" text="" /> : null}
    </section>
  );
};

export default Page;
