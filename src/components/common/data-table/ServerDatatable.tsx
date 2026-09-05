"use client";

import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
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

import { useEffect, useMemo, useState } from "react";

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
import { Card, CardContent } from "@/components/ui/card";

interface ServerDatatableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalRows: number;

  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;

  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;

  search?: string;
  onSearchChange?: (value: string) => void;

  enableSearch?: boolean;
  enableColumnVisibility?: boolean;

  downloadButton?: React.ReactNode;
  headerAction?: React.ReactNode;

  loading?: boolean;
  error?: string;
  title?: string;

  skeletonRows?: number;
  pageSizeOptions?: number[];
  searchDebounceMs?: number;
}

export default function ServerDatatable<TData, TValue>({
  columns,
  data,
  totalRows,

  pagination,
  onPaginationChange,

  sorting = [],
  onSortingChange,

  search = "",
  onSearchChange,

  enableSearch = false,
  enableColumnVisibility = false,

  downloadButton,
  headerAction,

  loading = false,
  error,

  title = "",

  skeletonRows = 5,

  pageSizeOptions = [10, 20, 30, 50, 100],

  searchDebounceMs = 300,
}: ServerDatatableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    if (!onSearchChange) {
      return;
    }

    const timeout = setTimeout(() => {
      if (searchValue !== search) {
        onSearchChange(searchValue);
      }
    }, searchDebounceMs);

    return () => clearTimeout(timeout);
  }, [searchValue, search, onSearchChange, searchDebounceMs]);

  const pageCount = useMemo(() => {
    if (pagination.pageSize <= 0) {
      return 0;
    }

    return Math.ceil(totalRows / pagination.pageSize);
  }, [totalRows, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnVisibility,
      pagination,
    },

    defaultColumn: {
      enableSorting: false,
    },

    manualPagination: true,
    manualSorting: true,

    pageCount,

    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,

    getCoreRowModel: getCoreRowModel(),
  });

  const currentPageIndex = pagination.pageIndex;
  const currentPageSize = pagination.pageSize;

  const startRow = totalRows === 0 ? 0 : currentPageIndex * currentPageSize + 1;

  const endRow =
    totalRows === 0
      ? 0
      : Math.min((currentPageIndex + 1) * currentPageSize, totalRows);

  return (
    <Card className="w-full p-0">
      <div className="border-b flex items-center justify-between p-4 bg-muted">
        <h1 className="font-bold text-2xl">{title}</h1>

        {headerAction}
      </div>

      <CardContent className="space-y-4 pb-2">
        <div className="flex w-full items-center justify-between gap-2">
          {enableSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                }}
                className="h-7.5 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          )}

          <div className="flex w-full items-center justify-end gap-2">
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
                    <TableHead className="w-[70px] text-center font-semibold">
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
                              onClick={
                                canSort
                                  ? header.column.getToggleSortingHandler()
                                  : undefined
                              }
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
                  Array.from({ length: skeletonRows }).map((_, index) => (
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
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length + 1}
                      className="h-40 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                          <AlertCircle className="size-5 text-destructive" />
                        </div>

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
                ) : data.length > 0 ? (
                  table.getRowModel().rows.map((row, index) => {
                    const serialNumber =
                      currentPageIndex * currentPageSize + index + 1;

                    return (
                      <TableRow
                        key={row.id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {serialNumber}
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
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length + 1}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <p className="text-sm font-medium">No Data Available</p>

                        <p className="text-xs text-muted-foreground">
                          {searchValue
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

        {!loading && totalRows > 0 && pageCount > 0 && (
          <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap text-muted-foreground">
                  Rows per page
                </span>

                <select
                  value={currentPageSize}
                  onChange={(event) => {
                    const newPageSize = Number(event.target.value);

                    onPaginationChange((previous) => ({
                      ...previous,
                      pageIndex: 0,
                      pageSize: newPageSize,
                    }));
                  }}
                  className="h-8 rounded-md border bg-background px-2.5 text-sm font-medium outline-none transition hover:bg-muted focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {pageSizeOptions.map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-sm text-muted-foreground sm:hidden">
                {startRow}–{endRow} of {totalRows}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="hidden text-sm text-muted-foreground sm:block">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startRow}–{endRow}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{totalRows}</span>
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5"
                  onClick={() => {
                    onPaginationChange((previous) => ({
                      ...previous,
                      pageIndex: Math.max(previous.pageIndex - 1, 0),
                    }));
                  }}
                  disabled={currentPageIndex <= 0}
                >
                  <ChevronLeft className="size-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pageCount }, (_, index) => index).map(
                    (pageIndex) => {
                      const currentPage = currentPageIndex;
                      const totalPages = pageCount;

                      if (totalPages <= 5) {
                        return (
                          <Button
                            key={pageIndex}
                            variant={
                              currentPage === pageIndex ? "default" : "outline"
                            }
                            size="icon"
                            className="size-8"
                            onClick={() => {
                              onPaginationChange((previous) => ({
                                ...previous,
                                pageIndex,
                              }));
                            }}
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
                            onClick={() => {
                              onPaginationChange((previous) => ({
                                ...previous,
                                pageIndex,
                              }));
                            }}
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
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5"
                  onClick={() => {
                    onPaginationChange((previous) => ({
                      ...previous,
                      pageIndex: Math.min(
                        previous.pageIndex + 1,
                        pageCount - 1,
                      ),
                    }));
                  }}
                  disabled={currentPageIndex >= pageCount - 1}
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
