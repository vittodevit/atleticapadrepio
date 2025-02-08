'use client';
import React, {useState, use} from 'react';
import {Documento} from "@prisma/client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Download,
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
import DataTable from "@/components/data-table";
import {Badge} from "@/components/ui/badge";
import ConditionalHider from "@/components/conditional-hider";
import {DocumentoCreateDialog} from "@/app/dashboard/documenti/documento-create-dialog";
import {toNiceDateNoTime} from "@/lib/utils";
import Link from "next/link";
import {DocumentoEditDialog} from "@/app/dashboard/documenti/documento-edit-dialog";
import mime from "mime";
import {DocumentoDeleteDialog} from "@/app/dashboard/documenti/documento-delete-dialog";

interface GestioneDocumentiTableProps {
  dataPromise: Promise<Documento[]>;
  editingEnabled: boolean;
}

const GestioneDocumentiTable: React.FC<GestioneDocumentiTableProps> = ({dataPromise, editingEnabled}) => {
  const tableData = use(dataPromise);
  const [data] = useState<Documento[]>(tableData);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columnVisibility = {
    tipoSocio: editingEnabled,
  };

  // Define columns with strict typing
  const columns: ColumnDef<Documento>[] = [
    {
      accessorKey: 'titolo',
      header: 'Titolo',
    },
    {
      accessorKey: 'descrizione',
      header: 'Descrizione',
    },
    {
      id: 'updatedAt',
      header: 'Ultima Modifica',
      cell : ({row}) => {
        const { updatedAt } = row.original;
        return toNiceDateNoTime(updatedAt);
      }
    },
    {
      id: 'mimeType',
      header: 'Tipo file',
      cell: ({row}) => {
        const { mimeType } = row.original;
        return (
          <Badge variant="secondary">{mime.getExtension(mimeType)}</Badge>
        );
      },
    },
    {
      id: 'tipoSocio',
      header: 'Destinatari',
      cell: ({row}) => {
        const { tipoSociDestinatari } = row.original;
        return (
          <div className="flex gap-2">
            {tipoSociDestinatari.map((tipoSocio) => (
              <Badge key={tipoSocio} variant="secondary">{tipoSocio.replace("_", " ")}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) =>
        <ActionsCell
          id={row.original.id}
          editingEnabled={editingEnabled}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
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
      columnVisibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <ConditionalHider hidden={!editingEnabled}>
        <DocumentoCreateDialog isDialogOpen={isCreateDialogOpen} setIsDialogOpen={setIsCreateDialogOpen} />
        <DocumentoEditDialog
          isDialogOpen={isEditDialogOpen}
          dialogData={dialogData}
          tableData={tableData}
          setIsDialogOpen={setIsEditDialogOpen}
        />
        <DocumentoDeleteDialog
          isDialogOpen={isDeleteDialogOpen}
          dialogData={dialogData}
          tableData={tableData}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
      </ConditionalHider>
      <DataTable
        table={table}
        columns={columns}
        editingEnabled={editingEnabled}
        handleNew={() => setIsCreateDialogOpen(true)}
      />
    </div>
  );
};

interface ActionsCellProps {
  id: string;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setDialogData: (data: string) => void;
  editingEnabled: boolean;
}

const ActionsCell: React.FC<ActionsCellProps> = (
  {id, setIsDeleteDialogOpen, setIsEditDialogOpen, setDialogData, editingEnabled}
) => {
  const handleEdit = () => {
    setDialogData(id);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDialogData(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" className="h-8 w-8 p-0" asChild>
        <Link href={`/api/documents/${id}`} target="_blank">
          <Download />
        </Link>
      </Button>
      <ConditionalHider hidden={!editingEnabled}>
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
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2 />
              Elimina
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ConditionalHider>
    </div>
  );
};

export default GestioneDocumentiTable;
