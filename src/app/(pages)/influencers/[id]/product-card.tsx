import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  image: string;
  category: string;
  name: string;
  price: number;
  rating: number;
  originalPrice?: number;
  isBestSeller?: boolean;
  size?: "small" | "large";
}

export function ProductCard({
  image,
  category,
  name,
  price,
  rating,
  originalPrice,
  isBestSeller = false,
  size = "small"
}: ProductCardProps) {
  return (
    <div
      className={`relative group overflow-hidden rounded-xl ${
        size === "small"
          ? "w-[280px] sm:w-[300px] h-[180px] sm:h-[200px]"
          : "w-full h-[250px] sm:h-[300px]"
      }`}
    >
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      {isBestSeller && (
        <Badge className="absolute top-3 right-3 bg-yellow-400 text-black">
          Best Seller
        </Badge>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="text-xs text-zinc-400 mb-1">{category}</div>
        <h3 className="text-white font-semibold mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-zinc-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
