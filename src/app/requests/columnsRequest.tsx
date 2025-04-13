"use client";

import AssingDesigner from "@/components/AssingDesigner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSessionStore } from "@/store/sessionStore";
import { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, FileX2, PencilRuler } from "lucide-react";

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
    accessorKey: "client",
    header: "cliente",
  },
  {
    accessorKey: "designer",
    header: "diseñador",
    cell: ({ row }) => {
      const profile = useSessionStore((state) => state.profile);
      const designer = row.original;
      console.log({ designer });
      return (
        <div className="flex items-center gap-2">
          <span>
            {designer.designer_id !== null
              ? "Asignado a: Diseñador"
              : "Sin asignar"}
          </span>
          {profile?.role === "pm" && (
            <Popover>
              <PopoverTrigger>
                <PencilRuler className="w-[16px] cursor-pointer hover:text-slate-700" />
              </PopoverTrigger>
              <PopoverContent>
                <AssingDesigner />
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
  },
  {
    accessorKey: "updated_at",
    header: "Fecha de actualización",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const profile = useSessionStore((state) => state.profile);
      const project = row.original;
      return (
        <>
          {profile?.role === "pm" && (
            <div className="flex items-center gap-2">
              <FilePenLine className="w-[16px] cursor-pointer hover:text-slate-700" />
              <FileX2 className="w-[16px] cursor-pointer hover:text-slate-700" />
            </div>
          )}
        </>
      );
    },
  },
];
