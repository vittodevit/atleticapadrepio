'use client';
import React, {useState, use} from 'react';
import {useRouter} from 'next/navigation';
import {Socio} from "@prisma/client";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {Badge} from "@/components/ui/badge";
import {
  Key,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {SocioDeleteDialog} from "@/app/dashboard/anagrafica/socio-delete-dialog";
import {SocioChangePasswordDialog} from "@/app/dashboard/anagrafica/socio-change-password-dialog";
import DataTable from "@/components/data-table";
import {toNiceDateNoTime} from "@/lib/utils";


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
      id: 'dataNascita',
      header: 'Data di nascita',
      cell: ({row}) => {
        const {dataNascita} = row.original;
        return (
          toNiceDateNoTime(dataNascita)
        );
      },
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
      <DataTable editingEnabled table={table} columns={columns} handleNew={handleNew} />
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
