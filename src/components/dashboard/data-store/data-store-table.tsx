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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon, Trash2, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/utils";
import AddNew from "./AddNew";
import { FileType, useGetFiles } from "@/hooks/files/use-get-files";

const DataStoreTable: React.FC<{
  useGetFilesProps: ReturnType<typeof useGetFiles>;
}> = ({ useGetFilesProps }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const {
    files,
    deleteFile,
    selectedFiles,
    setSelectedFiles,
    loading,
    deleteMultiFiles,
    chatbot,
  } = useGetFilesProps;

  const filteredData = useMemo(() => {
    return files.filter((file: FileType) => {
      const matchesSearch = file.fileName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesType = !typeFilter || file.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, searchValue, typeFilter]);

  const columns: ColumnDef<FileType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            table.getFilteredRowModel().rows.every((row) =>
              selectedFiles.includes(row.original.id)
            )
          }
          onCheckedChange={(value) => {
            const newSelectedFiles = value
              ? [
                  ...selectedFiles,
                  ...table
                    .getFilteredRowModel()
                    .rows.map((row) => row.original.id)
                    .filter((id) => !selectedFiles.includes(id)),
                ]
              : selectedFiles.filter(
                  (id) =>
                    !table
                      .getFilteredRowModel()
                      .rows.map((row) => row.original.id)
                      .includes(id)
                );
            setSelectedFiles(newSelectedFiles);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const fileId = row.original.id;
        return (
          <Checkbox
            checked={selectedFiles.includes(fileId)}
            onCheckedChange={(value) => {
              setSelectedFiles((prev) =>
                value
                  ? [...prev, fileId]
                  : prev.filter((id) => id !== fileId)
              );
            }}
            aria-label="Select row"
          />
        );
      },
    },
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center space-x-2">
            <span className="max-w-[200px] truncate">{file.fileName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center space-x-2">
            {file.type === "file" ? (
              <>
                <Badge variant="secondary">
                  <FileIcon className="w-4 h-4 mr-1" />
                  FILE
                </Badge>
                <Badge variant="outline">{formatFileSize(file.size)}</Badge>
              </>
            ) : file.type === "web" ? (
              <Badge variant="default">WEB</Badge>
            ) : (
              <Badge variant="default">YOUTUBE</Badge>
            )}
            {selectedFiles.includes(file.id) && (
              <Badge variant="outline">Selected</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isSelected = selectedFiles.includes(row.original.id);
        return (
          <Button variant="ghost" onClick={() => deleteFile(row.original.id)}>
            {isSelected && loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
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
      rowSelection: Object.fromEntries(selectedFiles.map(id => [id, true])),
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        const newSelection = updater(
          Object.fromEntries(selectedFiles.map(id => [id, true]))
        );
        setSelectedFiles(Object.keys(newSelection).filter(id => newSelection[id]));
      }
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value === "all" ? null : value);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center py-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-3/5 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search by file name..."
            value={searchValue}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <Select onValueChange={handleTypeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-2/5 flex justify-center sm:justify-end space-x-2">
          <AddNew chatbotId={chatbot?.id} />
          {selectedFiles.length > 0 && (
            <Button variant="destructive" onClick={deleteMultiFiles}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedFiles.length}
              )
            </Button>
          )}
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

export default DataStoreTable;
