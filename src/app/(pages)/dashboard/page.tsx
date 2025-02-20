"use client";

import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DashboardSingleCard from "@/components/dashboard-single-card";
import { Activity, ListChecks, Phone, Users } from "lucide-react";
import { DashboardBarChart } from "@/components/dashboard-bar-chart";
import { DashboardPieChart } from "@/components/dashboard-pie-chart";
import { DashboardTable } from "@/components/dashboard-table";
import { processData, getRecentLeads } from "@/utils/dashboard-utils";
import { fetchUserActivity } from "@/services/api";
import { UserData } from "@/utils/dashboard-utils";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<ReturnType<typeof processData> | null>(null);
  const [recentLeads, setRecentLeads] = useState<ReturnType<typeof getRecentLeads> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserActivity();
        setDashboardData(processData(data));
        setRecentLeads(getRecentLeads(data));
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to safely get top item
  const getTopItem = (obj: Record<string, number>) => {
    const entries = Object.entries(obj);
    return entries.length > 0 ? entries.sort((a, b) => b[1] - a[1])[0][0] : 'None';
  };

  if (isLoading) {
    return (
      <ContentLayout title="Dashboard">
        <div className="flex items-center justify-center h-[50vh]">
          <p>Loading dashboard data...</p>
        </div>
      </ContentLayout>
    );
  }

  if (error || !dashboardData || !recentLeads) {
    return (
      <ContentLayout title="Dashboard">
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-red-500">{error || 'Failed to load data'}</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardSingleCard
          title="Total Users"
          icon={<Users />}
          highlight={dashboardData.uniqueUsers.toString()}
          smallDetail="Unique phone numbers"
        />
        <DashboardSingleCard
          title="Total Leads"
          icon={<ListChecks />}
          highlight={dashboardData.totalLeads.toString()}
          smallDetail="Total activities"
        />
        <DashboardSingleCard
          title="Top Category"
          icon={<Activity />}
          highlight={getTopItem(dashboardData.categoryCount)}
          smallDetail="Most popular category"
        />
        <DashboardSingleCard
          title="Top Source"
          icon={<Phone />}
          highlight={getTopItem(dashboardData.sourceCount)}
          smallDetail="Most common lead source"
        />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <DashboardBarChart data={dashboardData.categoryCount} />
        </div>
        <div>
          <DashboardPieChart data={dashboardData.sourceCount} />
        </div>
      </div>

      <div className="mt-4">
        <DashboardTable data={recentLeads} />
      </div>
    </ContentLayout>
  );
}
