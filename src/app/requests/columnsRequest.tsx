"use client";

import AssingDesigner from "@/components/AssingDesigner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { deleteProject } from "@/lib/request";
import { useRequestStore } from "@/store/requestStore";
import { useSessionStore } from "@/store/sessionStore";
import { ColumnDef } from "@tanstack/react-table";
import { FileX2, PencilRuler } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export type Request = {
  id: string;
  title: string;
  description: string;
  client_id: string;
  designer_id: string;
  files: string | string[] | null | undefined;
  created_at: string;
  updated_at: string;
};

export const columnsRequest: ColumnDef<Request>[] = [
  {
    accessorKey: "title",
    header: "Titulo",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "client.full_name",
    header: "cliente",
  },
  {
    accessorKey: "designer",
    header: "diseñador",
    cell: ({ row }) => {
      const profile = useSessionStore((state) => state.profile);
      const project = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>
            {project.designer_id !== null
              ? `Asignado a: ${project?.designer?.full_name}`
              : "Sin asignar"}
          </span>
          {profile?.role === "pm" && (
            <Popover>
              <PopoverTrigger>
                <PencilRuler className="w-[16px] cursor-pointer hover:text-slate-700" />
              </PopoverTrigger>
              <PopoverContent>
                <AssingDesigner projectId={project.id} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "files",
    header: "Archivos",
    cell: ({ row }) =>
      row.getValue("files") === null
        ? "0"
        : (row.getValue("files") as string).length,
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return date ? dayjs(date).locale("es").format("LLL") : "";
    },
  },
  {
    accessorKey: "updated_at",
    header: "Fecha de actualización",
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return date ? dayjs(date).locale("es").format("LLL") : "";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const profile = useSessionStore((state) => state.profile);
      const requests = useRequestStore((state) => state.requests);
      const setRequests = useRequestStore((state) => state.setRequests);
      const project = row.original;
      return (
        <>
          {profile?.role === "pm" && (
            <div className="flex items-center gap-2">
              {/* <FilePenLine className="w-[16px] cursor-pointer hover:text-slate-700" /> */}
              <Popover>
                <PopoverTrigger>
                  <FileX2 className="w-[16px] cursor-pointer hover:text-slate-700" />
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <span className="text-xs text-balance block mb-2 w-fit">
                    ¿Estás seguro de que quieres eliminar este proyecto?
                  </span>
                  <Button
                    onClick={() => {
                      deleteProject(project.id).then((deletedProject) => {
                        if (deletedProject) {
                          const updatedRequests = requests
                            ? requests.filter((req) => req.id !== project.id)
                            : [];
                          setRequests(updatedRequests);
                        }
                      });
                    }}
                    variant="destructive"
                    className="w-fit cursor-pointer"
                  >
                    Eliminar
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </>
      );
    },
  },
];
