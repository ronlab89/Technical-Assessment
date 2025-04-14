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
    cell: ({ row }) => <DesignerCell project={row.original} />,
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
    cell: ({ row }) => <ActionsCell project={row.original} />,
  },
];
