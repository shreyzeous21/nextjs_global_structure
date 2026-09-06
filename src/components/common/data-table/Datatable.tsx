"use client";

import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Columns3,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

import React, { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableSearch?: boolean;
  enableColumnVisibility?: boolean;
  downloadButton?: React.ReactNode;
  loading?: boolean;
  error?: string;
  title?: string;
  headerAction?: React.ReactNode;
  filterSection?: React.ReactNode;
}

export default function Datatable<TData, TValue>({
  columns,
  data,
  downloadButton,
  enableSearch = false,
  enableColumnVisibility = false,
  loading = false,
  error,
  title = "",
  headerAction,
  filterSection,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnVisibility,
      globalFilter,
      pagination,
    },

    defaultColumn: {
      enableSorting: false,
    },

    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="w-full p-0">
      <div className="border-b flex items-center justify-between p-4 bg-muted">
        <h1 className="font-bold text-2xl">{title}</h1>

        {headerAction}
      </div>

      {filterSection && (
        <CardHeader className="border-b">{filterSection}</CardHeader>
      )}

      <CardContent className="space-y-4 pb-2">
        <div className="flex w-full items-center justify-between gap-2">
          {enableSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="h-7.5 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          )}

          <div className="flex w-full justify-end items-center gap-2">
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline">
                      <Columns3 className="size-4" />
                      <span>Show Columns</span>
                    </Button>
                  }
                />

                <DropdownMenuContent align="end" className="w-56 p-0">
                  <DropdownMenuGroup className="px-3 py-2.5">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold">
                      Show Columns
                    </DropdownMenuLabel>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Select columns to display
                    </p>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <div className="max-h-64 overflow-y-auto p-1.5">
                    {table
                      .getAllLeafColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        const header = column.columnDef.header;
                        const label =
                          typeof header === "string" ? header : column.id;

                        return (
                          <label
                            key={column.id}
                            className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted"
                          >
                            <Checkbox
                              checked={column.getIsVisible()}
                              onCheckedChange={(checked) => {
                                column.toggleVisibility(!!checked);
                              }}
                            />

                            <span className="flex-1 truncate">{label}</span>
                          </label>
                        );
                      })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {downloadButton}
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <TableHead className="w-17.5 text-center font-semibold">
                      S.No.
                    </TableHead>

                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();

                      return (
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap"
                        >
                          {header.isPlaceholder ? null : (
                            <button
                              type="button"
                              disabled={!canSort}
                              onClick={header.column.getToggleSortingHandler()}
                              className={`flex items-center gap-2 font-semibold ${
                                canSort
                                  ? "cursor-pointer select-none hover:text-foreground"
                                  : "cursor-default"
                              }`}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                              {canSort && (
                                <>
                                  {sorted === "asc" && (
                                    <ArrowUp className="size-4" />
                                  )}
                                  {sorted === "desc" && (
                                    <ArrowDown className="size-4" />
                                  )}
                                  {!sorted && (
                                    <ChevronsUpDown className="size-4 text-muted-foreground" />
                                  )}
                                </>
                              )}
                            </button>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {loading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-4 w-6" />
                      </TableCell>

                      {table.getVisibleLeafColumns().map((column) => (
                        <TableCell key={column.id}>
                          <Skeleton className="h-4 w-full max-w-[180px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : error ? (
                  // Error state
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length + 1}
                      className="h-40 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        {/* Icon */}
                        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                          <AlertCircle className="size-5 text-destructive" />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-sm font-semibold text-foreground">
                            Something went wrong
                          </p>

                          <p className="max-w-md text-sm text-muted-foreground">
                            {error ||
                              "Unable to load the data. Please try again later."}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length > 0 ? (
                  // Data state
                  table.getRowModel().rows.map((row, index) => {
                    const pageIndex = table.getState().pagination.pageIndex;
                    const pageSize = table.getState().pagination.pageSize;
                    const serialNo = pageIndex * pageSize + index + 1;

                    return (
                      <TableRow
                        key={row.id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {serialNo}
                        </TableCell>

                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  // Empty state
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length + 1}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <p className="text-sm font-medium">No Data Available</p>

                        <p className="text-xs text-muted-foreground">
                          {globalFilter
                            ? "No records match your search."
                            : "There are no records to display."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!loading && table.getPageCount() > 0 && (
          <div className=" flex flex-col gap-4 rounded-lg border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">
                  Rows per page
                </span>

                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(event) => {
                    table.setPageSize(Number(event.target.value));
                  }}
                  className="h-8 rounded-md border bg-background px-2.5 text-sm font-medium outline-none transition hover:bg-muted focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {[10, 20, 30, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-sm text-muted-foreground sm:hidden">
                {(() => {
                  const pageIndex = table.getState().pagination.pageIndex;
                  const pageSize = table.getState().pagination.pageSize;
                  const totalRows = table.getFilteredRowModel().rows.length;

                  const start = pageIndex * pageSize + 1;
                  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

                  return `${start}–${end} of ${totalRows}`;
                })()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="hidden text-sm text-muted-foreground sm:block">
                {(() => {
                  const pageIndex = table.getState().pagination.pageIndex;
                  const pageSize = table.getState().pagination.pageSize;
                  const totalRows = table.getFilteredRowModel().rows.length;

                  const start = pageIndex * pageSize + 1;
                  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

                  return (
                    <>
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {start}–{end}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground">
                        {totalRows}
                      </span>
                    </>
                  );
                })()}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="size-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: table.getPageCount() },
                    (_, index) => index,
                  ).map((pageIndex) => {
                    const currentPage = table.getState().pagination.pageIndex;

                    const totalPages = table.getPageCount();

                    if (totalPages <= 5) {
                      return (
                        <Button
                          key={pageIndex}
                          variant={
                            currentPage === pageIndex ? "default" : "outline"
                          }
                          size="icon"
                          className="size-8"
                          onClick={() => table.setPageIndex(pageIndex)}
                        >
                          {pageIndex + 1}
                        </Button>
                      );
                    }

                    const isFirst = pageIndex === 0;
                    const isLast = pageIndex === totalPages - 1;
                    const isCurrent = pageIndex === currentPage;
                    const isNearCurrent =
                      Math.abs(pageIndex - currentPage) <= 1;

                    if (isFirst || isLast || isCurrent || isNearCurrent) {
                      return (
                        <Button
                          key={pageIndex}
                          variant={
                            currentPage === pageIndex ? "default" : "outline"
                          }
                          size="icon"
                          className="size-8"
                          onClick={() => table.setPageIndex(pageIndex)}
                        >
                          {pageIndex + 1}
                        </Button>
                      );
                    }

                    if (pageIndex === 1 || pageIndex === totalPages - 2) {
                      return (
                        <span
                          key={pageIndex}
                          className="flex size-8 items-center justify-center text-sm text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
