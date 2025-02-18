"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Influencer = {
  id: number;
  name: string;
  city: string;
  category: string;
  img: string;
};

export const inColumns: ColumnDef<Influencer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/influencers/${row.original.id}`}
        className="flex items-center gap-4 hover:text-primary transition-colors"
      >
        <span className="w-10 h-10 rounded-full overflow-hidden relative">
          <Avatar className="w-full h-full object-cover left-0 top-0 absolute">
            <AvatarImage src={row.original.img} />
            <AvatarFallback>{row.original.name}</AvatarFallback>
          </Avatar>
        </span>
        <span>{row.original.name}</span>
      </Link>
    )
  },
  {
    accessorKey: "city",
    header: "City"
    /* 
    cell: ({ row }) => {
      const cityContent = row.getValue("city");
      return (
        <Badge variant="outline" className="font-normal">
          {cityContent}
        </Badge>
      );
    },
     */
  },
  {
    accessorKey: "category",
    header: "Category"
    /* 
    cell: ({ row }) => {
      const categoryContent = row.getValue("category");
      return (
        <Badge variant="outline" className="font-normal">
          {categoryContent}
        </Badge>
      );
    },
     */
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const influencerAction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2">
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(influencerAction.id.toString())
              }
            >
              Copy Influencer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
