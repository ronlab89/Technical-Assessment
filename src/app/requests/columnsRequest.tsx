"use client";

import { ColumnDef } from "@tanstack/react-table";
import DesignerCell from "@/components/DesignerCell";
import ActionsCell from "@/components/ActionsCell";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export type Request = {
  id: string;
  title: string;
  description: string;
  client_id: string;
  client?: {
    full_name: string;
  };
  designer_id: string;
  designer?: {
    full_name: string;
    email: string;
  };
  files: string | string[] | null | undefined;
  created_at: string;
  updated_at: string;
};

export const columnsRequest: ColumnDef<Request>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: "Titulo",
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Descripción",
  },
  {
    id: "client",
    accessorKey: "client",
    header: "cliente",
    cell: ({ row }) => <span>{row.original?.client?.full_name}</span>,
  },
  {
    id: "designer",
    accessorKey: "designer",
    header: "diseñador",
    cell: ({ row }) => <DesignerCell project={row.original} />,
  },
  {
    id: "files",
    accessorKey: "files",
    header: "Archivos",
    cell: ({ row }) =>
      row.getValue("files") === null
        ? "0"
        : (row.getValue("files") as string).length,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return date ? dayjs(date).locale("es").format("LLL") : "";
    },
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: "Fecha de actualización",
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return date ? dayjs(date).locale("es").format("LLL") : "";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell project={row.original} />,
  },
];
