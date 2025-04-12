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

const Page = async () => {
  const data = await getAllRequests();

  return (
    <section className="flex w-[81.5vw] min-h-screen flex-col items-start justify-start relative px-[40px]">
      <article className="absolute top-0 right-[20px]">
        <UserNav />
      </article>
      <article className="container mx-auto py-[100px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="submit" className="w-fit my-5 cursor-pointer ml-auto">
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
        <DataTable columns={columnsRequest} data={data ?? []} />
      </article>
    </section>
  );
};

export default Page;
