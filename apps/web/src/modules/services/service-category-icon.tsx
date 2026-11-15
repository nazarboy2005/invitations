import {
  Building2,
  CakeSlice,
  Camera,
  CarFront,
  Flower2,
  Gem,
  Headphones,
  LayoutGrid,
  Mail,
  Mic,
  MicVocal,
  Paintbrush,
  PartyPopper,
  Shirt,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

const categoryIcons = {
  restaurant: UtensilsCrossed,
  "photo-video": Camera,
  wedding: Building2,
  invitation: Mail,
  toastmaster: Mic,
  singer: MicVocal,
  dj: Headphones,
  decor: Sparkles,
  florist: Flower2,
  dress: Shirt,
  rings: Gem,
  car: CarFront,
  makeup: Paintbrush,
  cakes: CakeSlice,
  caravan: PartyPopper,
};

export function ServiceCategoryIcon({
  category,
  size = 18,
}: {
  category?: string;
  size?: number;
}) {
  const Icon =
    categoryIcons[category as keyof typeof categoryIcons] ?? LayoutGrid;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
