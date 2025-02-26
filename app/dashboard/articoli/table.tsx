'use client';
import React, {useState, use} from 'react';
import {useRouter} from 'next/navigation';
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
  MoreHorizontal,
  Pencil, Rss,
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
import {toNiceDateNoTime} from "@/lib/utils";
import {ArticoloDeleteDialog} from "@/app/dashboard/articoli/articolo-delete-dialog";
import {ArticoloPublishDialog} from "@/app/dashboard/articoli/articolo-publish-dialog";

export interface DBResult {
  id: string,
  titolo: string,
  slug: string,
  pubblicato: boolean,
  updatedAt: Date,
  categorie: {
    nome: string
  }[]
}

interface GestioneArticoliTableProps {
  dataPromise: Promise<DBResult[]>;
}

const GestioneArticoliTable: React.FC<GestioneArticoliTableProps> = ({dataPromise}) => {
  const tableData = use(dataPromise);
  const [data] = useState<DBResult[]>(tableData);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Define columns with strict typing
  const columns: ColumnDef<DBResult>[] = [
    {
      accessorKey: 'titolo',
      header: 'Titolo',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      id: 'categorie',
      header: 'Categorie',
      cell: ({row}) => {
        const {categorie} = row.original;
        return (
          categorie.map((cat, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {cat.nome}
            </Badge>
          ))
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Ultima Modifica',
      cell: ({row}) => {
        const {updatedAt} = row.original;
        return toNiceDateNoTime(updatedAt);
      },
    },
    {
      accessorKey: 'pubblicato',
      header: 'Pubblico',
      cell: ({row}) => {
        const {pubblicato} = row.original;
        return (
          <Badge variant={pubblicato ? "default" : "destructive"}>
            {pubblicato ? "Sì" : "No"}
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
          setDialogData={setDialogData}
          setIsPublishDialogOpen={setIsPublishDialogOpen}s
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
    router.push(`/dashboard/articoli/new`);
  }


  return (
    <div>
      <ArticoloDeleteDialog
        isDialogOpen={isDeleteDialogOpen}
        dialogData={dialogData}
        tableData={data}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />
      <ArticoloPublishDialog
        isDialogOpen={isPublishDialogOpen}
        dialogData={dialogData} tableData={data}
        setIsDialogOpen={setIsPublishDialogOpen}
      />
      <DataTable editingEnabled table={table} columns={columns} handleNew={handleNew} />
    </div>
  );
};

interface ActionsCellProps {
  id: string;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setDialogData: (data: string) => void;
  setIsPublishDialogOpen: (open: boolean) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = (
  {id, setIsDeleteDialogOpen, setDialogData, setIsPublishDialogOpen}
) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/articoli/${id}`);
  };

  const handleDelete = () => {
    setDialogData(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePubChange = () => {
    setDialogData(id);
    setIsPublishDialogOpen(true);
  }

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
        <DropdownMenuItem onClick={handlePubChange}>
          <Rss />
          Cambia stato pubblicazione
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 />
          Elimina
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GestioneArticoliTable;
