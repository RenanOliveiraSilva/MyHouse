export interface FurnitureItem {
  id: string;
  roomId: string;
  name: string;
  price: number;
  quantity: number;
  storeUrl?: string;
  storeName?: string;
  purchased: boolean;
  purchasedAt?: string;
  order: number;
  notes?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface HouseData {
  totalBudget: number;
  rooms: Room[];
  items: FurnitureItem[];
}

export interface StatsSummary {
  plannedTotal: number;
  purchasedTotal: number;
  remainingToBuyTotal: number;
  totalItemsCount: number;
  purchasedItemsCount: number;
}
