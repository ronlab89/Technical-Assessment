"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/store/usersStore";
import { assignDesigner } from "@/lib/request";
import { useRequestStore } from "@/store/requestStore";

const FormSchema = z.object({
  security_emails: z.boolean(),
});

const AssingDesigner = ({ projectId }: { projectId: string }) => {
  const users = useUserStore((state) => state.users);
  const requests = useRequestStore((state) => state.requests);
  const setRequests = useRequestStore((state) => state.setRequests);
  const selectedDesignerId = useRequestStore(
    (state) => state.selectedDesignerId
  );
  const setSelectedDesignerId = useRequestStore(
    (state) => state.setSelectedDesignerId
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  const handleSwitchChange = async (designerId: string) => {
    // Obtener el ID del diseñador actualmente asignado desde el store
    const currentDesigner = selectedDesignerId.find(
      (item) => item.projectId === projectId
    )?.designerId;

    // Si es el mismo, lo quitamos (set null), si es otro, lo cambiamos
    const newValue = currentDesigner === designerId ? null : designerId;

    // Actualizamos en el store
    setSelectedDesignerId(projectId, newValue);

    // Actualizamos en la base de datos
    const assigned = await assignDesigner({ projectId, designerId: newValue });

    if (assigned) {
      const updatedProjects =
        requests?.map((project) =>
          project.id === projectId
            ? {
                ...project,
                designer_id: assigned.designer_id,
                designer: assigned.designer,
                updated_at: new Date().toISOString(),
              }
            : project
        ) || [];

      setRequests(updatedProjects);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-sm font-medium">Asigna un diseñador</h3>
          {users?.length === 0 ? (
            <span>No hay diseñadores</span>
          ) : (
            users?.map((designer) => {
              const assigned = selectedDesignerId.find(
                (item) => item.projectId === projectId
              );
              return (
                <div className="mb-2" key={designer.id}>
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-xs">
                        {designer.full_name}
                      </FormLabel>
                      <FormDescription className="text-xs truncate">
                        {designer.email}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={
                          assigned?.designerId === designer.id &&
                          assigned?.projectId === projectId
                        }
                        onCheckedChange={() => handleSwitchChange(designer.id)}
                        disabled={
                          assigned?.designerId !== null &&
                          assigned?.designerId !== designer.id &&
                          assigned?.projectId === projectId
                        }
                        className="cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              );
            })
          )}
        </div>
      </form>
    </Form>
  );
};

export default AssingDesigner;
