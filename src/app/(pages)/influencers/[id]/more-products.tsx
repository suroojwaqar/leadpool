import { ProductCard } from "./product-card";

const moreProducts = [
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vrrfODqRhzYNzdd55S7x50gANiCTDA.png",
    category: "Tech",
    name: "PowerBank 20000mAh",
    price: 92.82,
    rating: 5
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vrrfODqRhzYNzdd55S7x50gANiCTDA.png",
    category: "Wearables",
    name: "SoundWave Bluetooth Speaker",
    price: 34.91,
    rating: 4.6,
    isBestSeller: true
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vrrfODqRhzYNzdd55S7x50gANiCTDA.png",
    category: "Wearables",
    name: "FitTrack Pro",
    price: 53.26,
    originalPrice: 67.15,
    rating: 4.3
  }
];

export function MoreProducts() {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
        More Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {moreProducts.map((product, index) => (
          <ProductCard key={index} {...product} size="large" />
        ))}
      </div>
    </div>
  );
}
