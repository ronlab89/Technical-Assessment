"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSessionStore } from "@/store/sessionStore";
import { useRequestStore } from "@/store/requestStore";
import { createProjectWithFiles } from "@/lib/request";

const formSchema = z.object({
  title: z
    .string({ required_error: "El título es obligatorio" })
    .min(1, { message: "El título es obligatorio" })
    .min(3, { message: "El título debe tener al menos 3 caracteres" }),
  description: z
    .string({ required_error: "La descripción es obligatoria" })
    .min(1, { message: "La descripción es obligatoria" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
});

export default function CreateProjectForm() {
  const user = useSessionStore((state) => state.user);
  const requests = useRequestStore((state) => state.requests);
  const setRequests = useRequestStore((state) => state.setRequests);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
      setRequests([...(requests || []), createdProject]);
      // Limpiar el form
      form.reset();
      // Limpiar el input de archivos
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
              ref={fileInputRef}
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="cursor-pointer"
            />
          </FormControl>
          {files.length > 0 && (
            <ul className="text-sm text-muted-foreground mt-2">
              {files.map((f) => (
                <li
                  key={f.name}
                  className="flex justify-start items-center gap-1"
                >
                  <span>📎 {f.name}</span>
                </li>
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
