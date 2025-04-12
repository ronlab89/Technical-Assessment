"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Request = {
  id: string;
  title: string;
  description: string;
  client_id: string;
  designer_id: string;
  files: string[];
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
  },
  {
    accessorKey: "files",
    header: "Archivos",
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
  },
  {
    accessorKey: "updated_at",
    header: "Fecha de actualización",
  },
];
