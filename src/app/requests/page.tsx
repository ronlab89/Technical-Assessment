"use client";
import { DataTable } from "@/components/DataTable";
import UserNav from "@/components/UserNav";
import { getAllRequests } from "@/lib/request";
import { columnsRequest } from "@/app/requests/columnsRequest";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateProjectForm from "@/components/CreateProjectForm";
import { useSessionStore } from "@/store/sessionStore";
import { useEffect, useState } from "react";
import { useRequestStore } from "@/store/requestStore";
import Loader from "@/components/Loader";
import { getAllUsers } from "@/lib/users";
import { useUserStore } from "@/store/usersStore";

const Page = () => {
  const profile = useSessionStore((state) => state.profile);
  const user = useSessionStore((state) => state.user);
  const setRequests = useRequestStore((state) => state.setRequests);
  const requests = useRequestStore((state) => state.requests);
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
    await getAllUsers({ setLoading, setUsers });
  };

  useEffect(() => {
    getRequest();
    if (profile?.role === "pm") getUsers();
  }, []);

  return (
    <section className="flex w-[81.5vw] min-h-screen flex-col items-start justify-start relative px-[40px]">
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
                <DialogTitle>Proyecto</DialogTitle>
                <DialogDescription>
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
