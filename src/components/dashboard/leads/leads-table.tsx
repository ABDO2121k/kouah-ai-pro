"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker";
import { useGetChatbot } from "@/hooks/chatbot/use-chatbot";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import { CSVLink } from "react-csv"; // Import CSVLink for CSV export

const LeadsTable: React.FC = () => {
  // State for table sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  // State for date range filter
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  // State for search input
  const [searchValue, setSearchValue] = useState("");

  // Custom hook to fetch chatbot data
  const { chatbot } = useGetChatbot();

  // Memoized data transformation from chatbot leads
  const data = useMemo(
    () =>
      //eslint-disable-next-line
      chatbot?.chatBotLeads.map((lead: any) => ({
        leadsData: lead.leadsData,
        createdAt: lead.createdAt,
      })) || [],
    [chatbot]
  );

  // Memoized filtered data based on date range and search value
  const filteredData = useMemo(() => {
    //eslint-disable-next-line
    return data.filter((item: any) => {
      // Date range filter
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        const itemDate = dayjs(item.createdAt);
        if (
          !itemDate.isAfter(dateRange.startDate) ||
          !itemDate.isBefore(dateRange.endDate)
        ) {
          return false;
        }
      }

      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        //eslint-disable-next-line
        return item.leadsData.some((leadItem: any) =>
          Object.values(leadItem).some((value) =>
            String(value).toLowerCase().includes(searchLower)
          )
        );
      }

      return true;
    });
  }, [data, dateRange, searchValue]);

  // Column definitions for the table
  const columns: ColumnDef<(typeof data)[0]>[] = [
    {
      id: "leadsData",
      header: "Leads Data",
      cell: ({ row }) => (
        <div className="w-full flex justify-center items-center">
          <Table className="w-[80%] lg:w-[40%] md:w-[65%] sm:w-[80%] bg-white border dark:bg-black">
            <TableBody>
              {/* eslint-disable-next-line */}
              {row.original.leadsData.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {item.fieldName}: {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return dayjs(row.getValue("createdAt")).format("DD/MM/YYYY HH:mm");
      },
    },
  ];

  // Initialize the table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // Handler for date range changes
  const handleDateRangeChange = (newDateRange: DateValueType) => {
    setDateRange(newDateRange);
  };

  // Handler for search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Prepare data for CSV export
  const csvData = useMemo(() => {
    //eslint-disable-next-line
    return filteredData.map((item: any) => ({
      ...item.leadsData.reduce(
        //eslint-disable-next-line
        (acc: any, curr: { fieldName: string; value: any }) => ({
          ...acc,
          [curr.fieldName]: curr.value,
        }),
        {}
      ),
      createdAt: `"${dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}"`,
    }));
  }, [filteredData]);

  // Get current date for filename
  const currentDate = dayjs().format("YYYY-MM-DD-HH-mm");

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center py-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-3/5 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search input */}
          <Input
            placeholder="Filter by value..."
            value={searchValue}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          {/* Date range picker */}
          <div className="relative w-full sm:w-64">
            <Datepicker
              value={dateRange}
              onChange={handleDateRangeChange}
              showShortcuts={true}
              primaryColor="blue"
              popoverDirection="down"
              toggleClassName="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              inputClassName="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              containerClassName="relative"
              displayFormat="DD/MM/YYYY"
            />
          </div>
        </div>
        <div className="w-full sm:w-2/5 flex justify-center sm:justify-end">
          {/* CSV export button */}
          <CSVLink data={csvData} filename={`leads_export_${currentDate}.csv`}>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </CSVLink>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LeadsTable;
