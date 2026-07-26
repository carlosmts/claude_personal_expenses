// Maps a category name to a display icon, mirroring the iOS CategoryStyle
// lookup. Falls back to a neutral icon for anything not in this curated
// list — categories are freeform (get-or-create by name), so this can never
// be exhaustive. Color is intentionally not part of this anymore: category
// tiles/charts are shaded by rank (see rankShade.ts), not by identity.
import {
  Banknote,
  Car,
  Coffee,
  Film,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  Plane,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Tag,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  groceries: ShoppingCart,
  food: UtensilsCrossed,
  restaurants: UtensilsCrossed,
  coffee: Coffee,
  salary: Banknote,
  rent: HomeIcon,
  housing: HomeIcon,
  utilities: Zap,
  transport: Car,
  car: Car,
  health: Heart,
  entertainment: Film,
  shopping: ShoppingBag,
  clothing: Shirt,
  travel: Plane,
  education: GraduationCap,
};

const FALLBACK_ICON: LucideIcon = Tag;

export function categoryIcon(categoryName: string): LucideIcon {
  return ICONS[categoryName.toLowerCase()] ?? FALLBACK_ICON;
}
