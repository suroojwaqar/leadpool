import { Profile } from "./profile";
import { FeaturedProducts } from "./featured-products";
import { MoreProducts } from "./more-products";
import { notFound } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";

interface Influencer {
  id: number;
  name: string;
  img: string;
  followers: string;
  city: string;
  joined: string;
  about: string;
  stats: {
    itemsSold: number;
    rating: number;
  };
  tags: string[];
  category: string;
}

// Import your JSON data with proper typing
const influencers: Influencer[] = require("../InfluencerData.json");

export default function InfluencerDetail({
  params
}: {
  params: { id: string };
}) {
  const influencer = influencers.find((i) => i.id === Number(params.id));

  if (!influencer) {
    notFound();
  }

  return (
    <ContentLayout title="Influencers">
      <div className="flex flex-col md:flex-row min-h-screen ">
        <Profile influencer={influencer} />
        <main className="flex-1 p-4 md:p-6">
          <FeaturedProducts />
          <MoreProducts />
        </main>
      </div>
    </ContentLayout>
  );
}
