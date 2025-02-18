"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React, { useState } from "react";
import InfluencerDrawer from "./InfluencerDrawer";
// import { Separator } from "@/components/ui/separator";
import { InDataTable } from "@/components/InDataTable";
import { Influencer, inColumns } from "./inColumns";
import InfluencerData from "./InfluencerData.json";
import { Toggle } from "@/components/ui/toggle";
import { Filter, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfluencerTopCharts } from "@/components/InfluencerTopCharts";
// import InfluencerFilters from "./InfluencerFilters";

export default function Influencers() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const data: Influencer[] = InfluencerData;

  const visibleData = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const handleSelectCard = (id: number) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  return (
    <ContentLayout title="Influencers">
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
              <BreadcrumbPage>Influencers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* View Toggle */}
      <div className="flex justify-end items-center mb-4">
        <InfluencerDrawer />
      </div>

      <div className="mb-4">
        <InfluencerTopCharts />
      </div>

      {/* Content */}
      <InDataTable columns={inColumns} data={data} />
    </ContentLayout>
  );
}
