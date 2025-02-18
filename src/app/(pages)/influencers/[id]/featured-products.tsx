"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";

const featuredProducts = [
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vrrfODqRhzYNzdd55S7x50gANiCTDA.png",
    category: "Lifestyle",
    name: "Wireless Earbuds Pro",
    price: 50.71,
    rating: 4.5
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vrrfODqRhzYNzdd55S7x50gANiCTDA.png",
    category: "Accessories",
    name: "SmartFit Watch X1",
    price: 34.7,
    originalPrice: 183.7,
    rating: 4.5
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vrrfODqRhzYNzdd55S7x50gANiCTDA.png",
    category: "Lifestyle",
    name: "ErgoBoost Laptop Stand",
    price: 35.92,
    originalPrice: 74.3,
    rating: 4.1
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vrrfODqRhzYNzdd55S7x50gANiCTDA.png",
    category: "Accessories",
    name: "ShieldPro Phone Case",
    price: 88.4,
    rating: 4.9
  }
];

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold ">Featured Products</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-7 w-7 md:h-8 md:w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-7 w-7 md:h-8 md:w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
      >
        {featuredProducts.map((product, index) => (
          <div key={index} className="snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
