"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import MetadataDrawer from "./MetadataDrawer";

export default function Metadata() {
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMetadata = async () => {
    try {
      const response = await fetch("https://useractivity.i-o.digital/metadata");
      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const columns = createColumns(fetchMetadata);

  return (
    <ContentLayout title="Metadata">
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
              <BreadcrumbPage>Metadata</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <MetadataDrawer onSuccess={fetchMetadata} />
      </div>

      <DataTable 
        columns={columns} 
        data={metadata} 
        onDataChange={fetchMetadata} 
      />
    </ContentLayout>
  );
}
