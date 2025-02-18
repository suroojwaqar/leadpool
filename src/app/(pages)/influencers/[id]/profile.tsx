import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";

interface ProfileProps {
  influencer: {
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
  };
}

export function Profile({ influencer }: ProfileProps) {
  return (
    <div className="w-full md:w-80 p-4 md:p-6 bg-white dark:bg-zinc-900 md:min-h-screen rounded-lg">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-3">
          <img
            src="https://avatar.iran.liara.run/public"
            alt="Profile picture"
            className="w-24 h-24 rounded-full object-cover"
          />
          <Badge className="absolute bottom-0 right-0 bg-primary-hex text-black">
            <Star className="h-3 w-3 fill-current" />
          </Badge>
        </div>
        <h2 className="text-xl font-semibold mb-1">{influencer.name}</h2>
        <p className="text-sm text-zinc-400 mb-3">5.2k followers</p>
        <div className="flex gap-2 w-full mb-4 md:mb-6">
          <Button className="flex-1 bg-primary-hex text-black hover:bg-[hsl(67,100%,70%)] text-sm md:text-base">
            Follow
          </Button>
          <Button variant="outline" className="flex-1 text-sm md:text-base">
            Message
          </Button>
        </div>
        <div className="flex flex-col gap-2 text-sm text-zinc-400 w-full">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Joined 2022-03-15</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>San Francisco, USA</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold dark:text-white mb-2">About</h3>
        <p className="text-sm text-zinc-400">
          Experienced IT professional with a passion for cybersecurity and
          network optimization.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold dark:text-white mb-3">
          Seller Stats
        </h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline">150</Badge>
            <span className="text-sm text-zinc-400">Items Sold</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-zinc-400">4.8/5</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold dark:text-white mb-3">
          Favorite Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {["cybersecurity", "networking", "cloud", "devops", "ai"].map(
            (tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-zinc-800 text-white"
              >
                {tag}
              </Badge>
            )
          )}
        </div>
      </div>
    </div>
  );
}
