// Maps a category name to a display icon + color for quick visual scanning,
// mirroring the iOS CategoryStyle lookup. Falls back to a neutral style for
// anything not in this curated list — categories are freeform (get-or-create
// by name), so this can never be exhaustive.
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

interface CategoryStyleEntry {
  icon: LucideIcon;
  color: string;
}

const STYLES: Record<string, CategoryStyleEntry> = {
  groceries: { icon: ShoppingCart, color: '#22c55e' },
  food: { icon: UtensilsCrossed, color: '#f97316' },
  restaurants: { icon: UtensilsCrossed, color: '#f97316' },
  coffee: { icon: Coffee, color: '#a16207' },
  salary: { icon: Banknote, color: '#10b981' },
  rent: { icon: HomeIcon, color: '#6366f1' },
  housing: { icon: HomeIcon, color: '#6366f1' },
  utilities: { icon: Zap, color: '#eab308' },
  transport: { icon: Car, color: '#3b82f6' },
  car: { icon: Car, color: '#3b82f6' },
  health: { icon: Heart, color: '#ef4444' },
  entertainment: { icon: Film, color: '#a855f7' },
  shopping: { icon: ShoppingBag, color: '#ec4899' },
  clothing: { icon: Shirt, color: '#ec4899' },
  travel: { icon: Plane, color: '#06b6d4' },
  education: { icon: GraduationCap, color: '#14b8a6' },
};

const FALLBACK: CategoryStyleEntry = { icon: Tag, color: '#6b7280' };

export function categoryStyle(categoryName: string): CategoryStyleEntry {
  return STYLES[categoryName.toLowerCase()] ?? FALLBACK;
}
