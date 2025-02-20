"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { UserActivity } from "@/lib/types/userActivity";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
  // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "PPP");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Add this new component before the columns definition
const CellAction = ({ id }: { id: string }) => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={() => router.push(`/user-activity/${id}`)}
    >
      View Details
    </Button>
  );
};

export const columns: ColumnDef<UserActivity>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => {
      const data = row.original;
      if (!data) return null;
      return (
        <span className="font-mono text-xs">
          {data._id ? data._id.toString().substring(0, 8) + "..." : "No ID"}
        </span>
      );
    }
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      if (!data?.createDate) return "No date";
      try {
        return formatDate(data.createDate);
      } catch (error) {
        console.error("Error formatting date:", error);
        return data.createDate;
      }
    }
  },
  {
    accessorKey: "activities",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Latest Activity" />
    ),
    cell: ({ row }) => {
      const activities = row.original.activities || [];
      const latestActivity = activities[0];
      return latestActivity
        ? `${latestActivity.category} - ${latestActivity.type}`
        : "N/A";
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction id={row.original._id} />
  }
];
