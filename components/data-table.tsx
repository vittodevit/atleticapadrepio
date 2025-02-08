"use client"
import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ColumnDef, flexRender, Table as TableType} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowUpDown,
  CirclePlus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ConditionalHider from "@/components/conditional-hider";

interface GreetingProps {
  // ATTENZIONE: Unico modo per generalizzare, vanno ignorate regole ESLint
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: TableType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<any>[];
  handleNew: () => void;
  editingEnabled: boolean;
}

const DataTable: React.FC<GreetingProps> = ({ table, columns, handleNew, editingEnabled }) => {

  // ottengo l'id della prima colonna
  const firstColumnId = columns[0].id;

  return (
    <section>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      width: header.column.id === 'actions' ? '1px' : 'auto',
                      paddingLeft: header.column.id === firstColumnId ? '10px' : ''
                    }}
                    className={header.column.id === 'actions' ? 'no-print' : ''}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {
                      header.column.getIsSorted() ?
                        (header.column.getIsSorted() === 'asc' ?
                            <Button variant="ghost">
                              <ArrowDownAZ/>
                            </Button> :
                            <Button variant="ghost">
                              <ArrowDownZA/>
                            </Button>
                        ) :
                        (header.column.getCanSort() ?
                          <Button variant="ghost">
                            <ArrowUpDown/>
                          </Button> :
                          '')
                    }
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center font-semibold">
                  <div className="mt-2 mb-2">
                    Nessun dato disponibile
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        paddingLeft: cell.column.id === firstColumnId ? '10px' : ''
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-2 mb-3 rounded-md border flex flex-row justify-between">
        <div className="mt-1 mb-1 ml-2">
          <div className="flex flex-row gap-2 mt-1">
            <ConditionalHider hidden={!editingEnabled}>
              <Button onClick={handleNew} variant="outline">
                <CirclePlus/>
                Aggiungi nuovo
              </Button>
            </ConditionalHider>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(e) => {
                table.setPageSize(Number(e));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona dimensione pagina" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Dimensione Pagina</SelectLabel>
                  {[5, 10, 20].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      Mostra {pageSize} elementi
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2 mb-2 mr-2 flex flex-row">
          <span className='mt-1.5 mr-1 text-neutral-500'>
            Pagina{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} di{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <div className="flex gap-1 ml-2" role="group" aria-label="Paginazione">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline" size="icon"
            >
              <ArrowBigLeft/>
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline" size="icon"
            >
              <ArrowBigRight/>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataTable;