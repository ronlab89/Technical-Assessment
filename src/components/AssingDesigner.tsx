"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUserStore } from "@/store/usersStore";

const FormSchema = z.object({
  designers: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

const AssingDesigner = () => {
  const users = useUserStore((state) => state.users);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    toast.success("El diseñador ha sido asignado");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-sm font-medium">Asigna un diseñador</h3>
          {users?.length === 0 ? (
            <span>No hay diseñadores</span>
          ) : (
            users?.map((designer) => (
              <div className="mb-2" key={designer?.id}>
                <FormField
                  control={form.control}
                  name="designers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-xs">
                          {designer?.full_name}
                        </FormLabel>
                        <FormDescription className="text-xs truncate">
                          {designer?.email}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))
          )}
        </div>
      </form>
    </Form>
  );
};

export default AssingDesigner;
