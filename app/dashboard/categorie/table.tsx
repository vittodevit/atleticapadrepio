'use client';
import React, {useState, use} from 'react';
import {Categoria} from "@prisma/client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
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
import {CategoriaCreateDialog} from "@/app/dashboard/categorie/categoria-create-dialog";
import {CategoriaEditDialog} from "@/app/dashboard/categorie/categoria-edit-dialog";
import {CategoriaDeleteDialog} from "@/app/dashboard/categorie/categoria-delete-dialog";

interface GestioneCategorieTableProps {
  dataPromise: Promise<Categoria[]>;
}

const GestioneCategorieTable: React.FC<GestioneCategorieTableProps> = ({dataPromise}) => {
  const tableData = use(dataPromise);
  const [data] = useState<Categoria[]>(tableData);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Define columns with strict typing
  const columns: ColumnDef<Categoria>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      accessorKey: 'descrizione',
      header: 'Descrizione',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) =>
        <ActionsCell
          id={row.original.id}
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
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <CategoriaCreateDialog isDialogOpen={isCreateDialogOpen} setIsDialogOpen={setIsCreateDialogOpen} />
      <CategoriaEditDialog
        isDialogOpen={isEditDialogOpen}
        dialogData={dialogData}
        tableData={data}
        setIsDialogOpen={setIsEditDialogOpen}
      />
      <CategoriaDeleteDialog
        isDialogOpen={isDeleteDialogOpen}
        dialogData={dialogData}
        tableData={data}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />
      <DataTable editingEnabled table={table} columns={columns} handleNew={() => setIsCreateDialogOpen(true)} />
    </div>
  );
};

interface ActionsCellProps {
  id: string;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setDialogData: (data: string) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = (
  {id, setIsDeleteDialogOpen, setIsEditDialogOpen, setDialogData}
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
  );
};

export default GestioneCategorieTable;
