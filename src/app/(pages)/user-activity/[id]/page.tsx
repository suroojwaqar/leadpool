"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserActivityResponse } from "@/lib/types/userActivity";

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "PPP");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export default function UserActivityDetailPage({ params }: { params: { id: string } }) {
  const [activity, setActivity] = useState<UserActivityResponse | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-activity/id/${params.id}`);
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchActivity();
  }, [params.id]);

  if (!activity) return <div>Loading...</div>;

  const activities = activity.activities || [];

  return (
    <ContentLayout title={`Activity Details - ${activity.phoneNumber}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/user-activity">User Activities</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Phone Number</p>
                <p>{activity.phoneNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Created Date</p>
                <p>{formatDate(activity.createDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {Array.isArray(activities) && activities.map((act, index) => (
          <Card key={act._id || index}>
            <CardHeader>
              <CardTitle>Activity {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Category</p>
                  <p>{act.category}</p>
                </div>
                <div>
                  <p className="font-semibold">Type</p>
                  <p>{act.type}</p>
                </div>
                <div>
                  <p className="font-semibold">Source</p>
                  <p>{act.source}</p>
                </div>
                <div>
                  <p className="font-semibold">Client</p>
                  <p>{act.client}</p>
                </div>
                <div>
                  <p className="font-semibold">Created Date</p>
                  <p>{formatDate(act.createDate)}</p>
                </div>
              </div>

              {act.otherInformation && Object.keys(act.otherInformation).length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Other Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(act.otherInformation).map(([key, value]) => (
                      <div key={key}>
                        <p className="font-semibold">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        <p>{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ContentLayout>
  );
}
