import type { StyleType } from '@prisma/client';

export interface SerializedSet {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  images: string[];
  standardPrice: number;
  premiumPrice: number;
  customPrice: number | null;
  isCustom: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface SerializedExtra {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface SerializedStyle {
  id: string;
  name: string;
  slug: string;
  type: StyleType;
  description: string | null;
  shortDescription: string | null;
  coverImage: string | null;
  badge: string | null;
  label: string | null;
  highlights: string[];
  duration: number | null;
  price: number | null;
  tierStandardHighlights: string[];
  tierPremiumHighlights: string[];
  tierStandardDuration: number | null;
  tierPremiumDuration: number | null;
  tierStandardTagline: string | null;
  tierPremiumTagline: string | null;
  isActive: boolean;
  isVisible: boolean;
  displayOrder: number;
  seasonStart: Date | null;
  seasonEnd: Date | null;
  sets: SerializedSet[];
  extras: SerializedExtra[];
}
