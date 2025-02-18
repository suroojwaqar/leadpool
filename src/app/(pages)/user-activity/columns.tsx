"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { UserActivity } from "@/lib/types/userActivity";

export const columns: ColumnDef<UserActivity>[] = [
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "activityCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Count" />
    ),
  },
];
