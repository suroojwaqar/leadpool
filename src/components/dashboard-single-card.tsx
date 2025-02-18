import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React from "react";

function DashboardSingleCard({
  title,
  icon,
  highlight,
  smallDetail
}: {
  title: string;
  icon?: React.ReactNode;
  highlight?: React.ReactNode;
  smallDetail?: string;
}) {
  return (
    <Card className="dark:bg-background/40 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{highlight}</div>
        <p className="text-xs text-muted-foreground">{smallDetail}</p>
      </CardContent>
    </Card>
  );
}

export default DashboardSingleCard;
