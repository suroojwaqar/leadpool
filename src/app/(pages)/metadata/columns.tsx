"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MetadataDrawer from "./MetadataDrawer"; // Changed import statement
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export type Metadata = {
  _id: string;
  name: string;
  type: string;
  createdDate: string;
};

export const createColumns = (onDataChange: () => void): ColumnDef<Metadata>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    cell: ({ row }) => {
      return new Date(row.getValue("createdDate")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const metadata = row.original;
      const [isEditing, setIsEditing] = useState(false);
      
      const handleDelete = async () => {
        try {
          const response = await fetch(`https://useractivity.i-o.digital/metadata/${metadata._id}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            toast({
              title: "Success",
              description: "Metadata deleted successfully",
            });
            onDataChange(); // Refresh data instead of page reload
          } else {
            throw new Error('Failed to delete metadata');
          }
        } catch (error) {
          console.error('Error deleting metadata:', error);
          toast({
            title: "Error",
            description: "Failed to delete metadata",
            variant: "destructive",
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(metadata._id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
          {isEditing && (
            <MetadataDrawer 
              mode="edit" 
              editData={metadata} 
              onSuccess={() => {
                onDataChange();
                setIsEditing(false);
              }}
              open={isEditing}
              onOpenChange={setIsEditing}
            />
          )}
        </DropdownMenu>
      );
    },
  },
];
