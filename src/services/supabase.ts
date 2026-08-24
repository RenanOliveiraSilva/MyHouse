import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FurnitureItem, HouseData, Room } from '@/types/house';
import { INITIAL_DATA, StorageService } from './storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('seu-projeto') &&
    !SUPABASE_ANON_KEY.includes('sua-chave')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
    })
  : null;

export const SupabaseService = {
  isConfigured: isSupabaseConfigured,

  async fetchAllData(): Promise<HouseData> {
    if (!supabase) {
      return StorageService.loadData();
    }

    try {
      // 1. Fetch House (Budget)
      const { data: houseData, error: houseError } = await supabase
        .from('houses')
        .select('*')
        .eq('id', 'main-house')
        .single();

      if (houseError && houseError.code !== 'PGRST116') {
        console.warn('Erro ao buscar house:', houseError);
      }

      // If house does not exist yet, create default
      if (!houseData) {
        await supabase.from('houses').upsert({
          id: 'main-house',
          name: 'Nossa Casinha',
          total_budget: 0,
        });
      }

      // 2. Fetch Rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('order', { ascending: true });

      if (roomsError) {
        console.warn('Erro ao buscar rooms:', roomsError);
      }

      // 3. Fetch Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .order('order', { ascending: true });

      if (itemsError) {
        console.warn('Erro ao buscar items:', itemsError);
      }

      const totalBudget = houseData ? Number(houseData.total_budget) : 0;

      const rooms: Room[] = (roomsData || []).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        order: r.order ?? 0,
      }));

      const items: FurnitureItem[] = (itemsData || []).map((i) => ({
        id: i.id,
        roomId: i.room_id,
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity) || 1,
        storeUrl: i.store_url || '',
        storeName: i.store_name || '',
        purchased: Boolean(i.purchased),
        purchasedAt: i.purchased_at || undefined,
        notes: i.notes || '',
        order: i.order ?? 0,
      }));

      const fullData: HouseData = {
        totalBudget,
        rooms,
        items,
      };

      // Keep local storage in sync as offline backup
      await StorageService.saveData(fullData);

      return fullData;
    } catch (err) {
      console.warn('Supabase fetch error, caindo para local:', err);
      return StorageService.loadData();
    }
  },

  async updateBudget(newBudget: number): Promise<void> {
    if (!supabase) return;
    await supabase.from('houses').upsert({
      id: 'main-house',
      total_budget: newBudget,
      updated_at: new Date().toISOString(),
    });
  },

  async addRoom(room: Room): Promise<void> {
    if (!supabase) return;
    await supabase.from('rooms').insert({
      id: room.id,
      house_id: 'main-house',
      name: room.name,
      description: room.description,
      order: room.order,
    });
  },

  async deleteRoom(roomId: string): Promise<void> {
    if (!supabase) return;
    // Cascade delete items for this room first, then room
    await supabase.from('items').delete().eq('room_id', roomId);
    await supabase.from('rooms').delete().eq('id', roomId);
  },

  async addItem(item: FurnitureItem): Promise<void> {
    if (!supabase) return;
    await supabase.from('items').insert({
      id: item.id,
      room_id: item.roomId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      store_url: item.storeUrl,
      store_name: item.storeName,
      purchased: item.purchased,
      order: item.order,
    });
  },

  async updateItem(item: FurnitureItem): Promise<void> {
    if (!supabase) return;
    await supabase
      .from('items')
      .update({
        room_id: item.roomId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        store_url: item.storeUrl,
        store_name: item.storeName,
        purchased: item.purchased,
        purchased_at: item.purchasedAt,
        notes: item.notes,
        order: item.order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);
  },

  async toggleItemPurchased(itemId: string, purchased: boolean): Promise<void> {
    if (!supabase) return;
    await supabase
      .from('items')
      .update({
        purchased,
        purchased_at: purchased ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);
  },

  async deleteItem(itemId: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('items').delete().eq('id', itemId);
  },
};
