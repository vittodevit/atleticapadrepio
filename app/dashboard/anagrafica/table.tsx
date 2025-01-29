'use client';
import React, {useState, use} from 'react';
import {useRouter} from 'next/navigation';
import {Socio} from "@prisma/client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {Badge} from "@/components/ui/badge";
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowUpDown, Key,
  MoreHorizontal, Pencil, Trash2,
  UserRoundPlus
} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {SocioDeleteDialog} from "@/app/dashboard/anagrafica/socio-delete-dialog";
import {SocioChangePasswordDialog} from "@/app/dashboard/anagrafica/socio-change-password-dialog";


interface GestioneSociTable {
  dataPromise: Promise<Socio[]>;
}

const GestioneSociTable: React.FC<GestioneSociTable> = ({dataPromise}) => {
  const tableData = use(dataPromise);
  const [data] = useState<Socio[]>(tableData);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
  const [changePasswordDialogKey, setChangePasswordDialogKey] = useState("start");
  const [dialogData, setDialogData] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Define columns with strict typing
  const columns: ColumnDef<Socio>[] = [
    {
      id: 'nome',
      header: 'Nome e Cognome',
      cell: ({row}) => {
        const {nome, cognome} = row.original;
        return `${nome} ${cognome}`;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'codiceFiscale',
      header: 'Codice Fiscale',
    },
    {
      id: 'tipoSocio',
      header: 'Tipo Socio',
      cell: ({row}) => {
        const {tipoSocio} = row.original;
        return (
          <Badge variant="secondary">
            {tipoSocio.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) =>
        <ActionsCell
          id={row.original.id}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setIsChangePasswordDialogOpen={setIsPasswordChangeDialogOpen}
          setDialogData={setDialogData}
        />
    }
  ];

  // Initialize the React Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const router = useRouter();
  const handleNew = () => {
    router.push(`/dashboard/anagrafica/new`);
  }

  const invalidateDialog = () => {
    setChangePasswordDialogKey(Math.random().toString());
  }

  return (
    <div>
      <SocioDeleteDialog
        isDialogOpen={isDeleteDialogOpen}
        dialogData={dialogData}
        setIsDialogOpen={setIsDeleteDialogOpen}
        tableData={data}
      />
      <SocioChangePasswordDialog
        isDialogOpen={isPasswordChangeDialogOpen}
        dialogData={dialogData}
        tableData={data}
        setIsDialogOpen={setIsPasswordChangeDialogOpen}
        invalidateDialog={invalidateDialog}
        key={changePasswordDialogKey}
      />
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
                      paddingLeft: header.column.id === 'nome' ? '10px' : '' // SE COPI E INCOLLI CAMBIA ANCHE QUESTO
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
                <TableCell colSpan={columns.length} className="text-center text-muted">
                  Nessun dato disponibile
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        paddingLeft: cell.column.id === 'nome' ? '10px' : '' // SE COPI E INCOLLI CAMBIA ANCHE QUESTO
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
            <Button onClick={handleNew} variant="outline">
              <UserRoundPlus/>
              Aggiungi nuovo
            </Button>
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
    </div>
  );
};

interface ActionsCellProps {
  id: string;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsChangePasswordDialogOpen: (open: boolean) => void;
  setDialogData: (data: string) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = (
  {id, setIsDeleteDialogOpen, setIsChangePasswordDialogOpen, setDialogData}
) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/anagrafica/${id}`);
  };

  const handleDelete = () => {
    setDialogData(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePasswordChange = () => {
    setDialogData(id);
    setIsChangePasswordDialogOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Apri menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Azioni</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil />
          Modifica
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePasswordChange}>
          <Key />
          Rigenera Password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 />
          Elimina
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GestioneSociTable;
