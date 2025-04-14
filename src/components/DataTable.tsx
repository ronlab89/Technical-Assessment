"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSessionStore } from "@/store/sessionStore";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const profile = useSessionStore((state) => state.profile);

  const hiddenColumnsByRole: Record<string, string[]> = {
    client: ["client", "designer"], // Oculta estas columnas para 'client'
    designer: [], // Por ahora no oculta nada para 'designer'
    pm: [], // Project manager ve todo
  };

  // 🔍 Filtramos las columnas dependiendo del rol del usuario
  const filteredColumns = columns.filter((col) => {
    const colId = col.id;
    const hiddenForRole = hiddenColumnsByRole[profile?.role || ""] || [];
    return !hiddenForRole.includes(colId as string);
  });

  const table = useReactTable({
    data,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {profile?.role === "designer"
                  ? "Aun no tienes proyectos asignados."
                  : profile?.role === "client"
                  ? "No tienes proyectos creados."
                  : "No se encontraron proyectos."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
