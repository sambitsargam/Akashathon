"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  hasStatusFilter?: boolean;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table, hasStatusFilter }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* TODO generic way to specify filters and sorting */}
        {/* <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={event => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
        {/* {hasStatusFilter && <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statuses} />} */}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {table.getAllColumns().filter(column => typeof column.accessorFn !== "undefined" && column.getCanHide()).length > 0 && (
        <DataTableViewOptions table={table} />
      )}
    </div>
  );
}
