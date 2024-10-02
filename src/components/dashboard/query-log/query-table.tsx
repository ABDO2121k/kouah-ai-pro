"use client";
import React, { useState, useMemo, useEffect } from "react";
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
import { Download, Copy } from "lucide-react";
import { CSVLink } from "react-csv";

const QueriesTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [searchValue, setSearchValue] = useState("");

  const { chatbot, setActions } = useGetChatbot();

  const data = useMemo(
    () =>
      //eslint-disable-next-line
      chatbot?.queries.map((query: any) => ({
        id: query.id,
        query: query.query,
        answer: query.answer,
        createdAt: query.createdAt,
      })) || [],
    [chatbot]
  );

  const filteredData = useMemo(() => {
    //eslint-disable-next-line
    return data.filter((item: any) => {
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        const itemDate = dayjs(item.createdAt);
        if (
          !itemDate.isAfter(dateRange.startDate) ||
          !itemDate.isBefore(dateRange.endDate)
        ) {
          return false;
        }
      }

      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        return (
          item.query.toLowerCase().includes(searchLower) ||
          item.answer.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [data, dateRange, searchValue]);

  useEffect(() => {
    setActions((prev) => prev + 1);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  };

  const columns: ColumnDef<(typeof data)[0]>[] = [
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return dayjs(row.getValue("createdAt")).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      accessorKey: "query",
      header: "Query",
    },
    {
      accessorKey: "answer",
      header: "Answer",
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        // `row.original` contains the original data for this row
        // We're assigning it to `queryData` for easier access in the JSX below
        const queryData = row.original;
        return (
          <Button
            variant="ghost"
            onClick={() =>
              copyToClipboard(
                `Query: ${queryData.query}\nAnswer: ${queryData.answer}`
              )
            }
          >
            <Copy className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

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

  const handleDateRangeChange = (newDateRange: DateValueType) => {
    setDateRange(newDateRange);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const csvData = useMemo(() => {
    //eslint-disable-next-line
    return filteredData.map((item: any) => ({
      ...item,
      createdAt: `"${dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}"`,
    }));
  }, [filteredData]);

  const currentDate = dayjs().format("YYYY-MM-DD-HH-mm");

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center py-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-3/5 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search queries..."
            value={searchValue}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
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
          <CSVLink
            data={csvData}
            filename={`queries_export_${currentDate}.csv`}
          >
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </CSVLink>
        </div>
      </div>
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

export default QueriesTable;
