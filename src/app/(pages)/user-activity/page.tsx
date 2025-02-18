// Original source file: src/app/%28pages%29/user-activity/page.tsx
"use client";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { columns } from "./columns";
import { getUserActivities } from "@/lib/services/userActivity";
import { useEffect, useState } from "react";
import { UserActivity } from "@/lib/types/userActivity";
import { DataTable } from "@/components/DataTable";
import { UserActivityForm } from "./UserActivityForm";
import { ExcelUpload } from "./ExcelUpload";

export default function UserActivityPage() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserActivities();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddActivity = async (formData: any) => {
    try {
      // Transform other information into object
      const otherInformation = formData.otherInformation.reduce((acc: any, item: any) => {
        acc[item.name] = item.value;
        return acc;
      }, {});

      const activityData = {
        phoneNumber: formData.phoneNumber,
        activities: [{
          category: formData.category,
          type: formData.type,
          source: formData.source,
          client: formData.client,
          createDate: new Date().toISOString(),
          otherInformation
        }],
        createDate: new Date().toISOString()
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(activityData)
        }
      );
    const data = await response.json();
    console.log("response", data);
    if (response.ok) {
      const newData = await getUserActivities();
      setActivities(newData);
    }
  } catch (error) {
      console.log("response",error);
      console.error('Error adding activity:', error);
    }
  };

  const handleBulkUpload = async (data: { phoneNumber: string }[]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-activity/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const newData = await getUserActivities();
        setActivities(newData);
      }
    } catch (error) {
      console.error('Error uploading bulk data:', error);
    }
  };

  return (
    <ContentLayout title="User Activities">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Activities</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <UserActivityForm onSubmit={handleAddActivity} />
        <ExcelUpload onUpload={handleBulkUpload} />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={activities} />
      )}
    </ContentLayout>
  );
}
