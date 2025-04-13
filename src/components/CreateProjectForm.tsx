"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { createProjectWithFiles } from "@/lib/request";
import { toast } from "sonner";
import { useRequestStore } from "@/store/requestStore";

// Esquema de validación con Zod
const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "El título debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
});

export default function CreateProjectForm() {
  const user = useSessionStore((state) => state.user);
  const requests = useRequestStore((state) => state.requests);
  const setRequests = useRequestStore((state) => state.setRequests);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("Usuario no autenticado");

      const createdProject = await createProjectWithFiles({
        title: values.title,
        description: values.description,
        clientId: user.id,
        files,
      });
      console.log("createdProject", createdProject);
      setRequests([...(requests || []), createdProject]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error al crear proyecto");
      } else {
        toast.error("Error al crear proyecto");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo de Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  placeholder="Escribe el título del proyecto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe el proyecto..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Archivos */}
        <FormItem>
          <FormLabel>Archivos adjuntos</FormLabel>
          <FormControl>
            <Input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="cursor-pointer"
            />
          </FormControl>
          {files.length > 0 && (
            <ul className="text-sm text-muted-foreground mt-2">
              {files.map((f) => (
                <li key={f.name}>📎 {f.name}</li>
              ))}
            </ul>
          )}
        </FormItem>

        {/* Botón de Envío */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer"
        >
          {loading ? "Creando..." : "Crear Proyecto"}
        </Button>
      </form>
    </Form>
  );
}
