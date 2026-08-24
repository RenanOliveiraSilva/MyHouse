import { useCallback, useEffect, useMemo, useState } from 'react';
import { FurnitureItem, HouseData, Room, StatsSummary } from '@/types/house';
import { INITIAL_DATA, StorageService } from '@/services/storage';
import { supabase, SupabaseService } from '@/services/supabase';

export function useHouseData() {
  const [data, setData] = useState<HouseData>(INITIAL_DATA);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Load from Supabase (or fallback to local AsyncStorage)
  const refreshData = useCallback(async () => {
    const loaded = await SupabaseService.fetchAllData();
    setData(loaded);
    if (loaded.rooms.length > 0) {
      setSelectedRoomId((current) => {
        if (current === 'all') return 'all';
        const exists = loaded.rooms.some((r) => r.id === current);
        return exists ? current : 'all';
      });
    } else {
      setSelectedRoomId('');
    }
  }, []);

  useEffect(() => {
    async function init() {
      await refreshData();
      setLoading(false);
    }
    init();

    // Setup Realtime Subscription if Supabase is connected
    if (supabase) {
      const client = supabase;
      const channel = client
        .channel('my-house-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          () => {
            refreshData();
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }
  }, [refreshData]);

  // Global Statistics
  const stats = useMemo<StatsSummary>(() => {
    const plannedTotal = data.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const purchasedTotal = data.items
      .filter((item) => item.purchased)
      .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const remainingToBuyTotal = plannedTotal - purchasedTotal;
    const totalItemsCount = data.items.length;
    const purchasedItemsCount = data.items.filter((item) => item.purchased).length;

    return {
      plannedTotal,
      purchasedTotal,
      remainingToBuyTotal,
      totalItemsCount,
      purchasedItemsCount,
    };
  }, [data.items]);

  // Selected Room (supports 'all' for full house view)
  const selectedRoom = useMemo<Room | null>(() => {
    if (data.rooms.length === 0) return null;
    if (selectedRoomId === 'all') {
      return {
        id: 'all',
        name: 'Todos os Móveis',
        description: 'Lista completa de todos os cômodos da casa',
        order: -1,
      };
    }
    return data.rooms.find((r) => r.id === selectedRoomId) || data.rooms[0] || null;
  }, [data.rooms, selectedRoomId]);

  // Items for Selected Room or all items
  const roomItems = useMemo(() => {
    if (data.rooms.length === 0) return [];
    if (selectedRoomId === 'all') {
      return [...data.items].sort((a, b) => a.order - b.order);
    }
    return data.items
      .filter((item) => item.roomId === selectedRoomId)
      .sort((a, b) => a.order - b.order);
  }, [data.items, data.rooms, selectedRoomId]);

  // Room Specific Stats
  const roomStats = useMemo(() => {
    const total = roomItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const count = roomItems.length;
    const boughtCount = roomItems.filter((i) => i.purchased).length;
    return {
      total,
      count,
      boughtCount,
      percentage: count > 0 ? (boughtCount / count) * 100 : 0,
    };
  }, [roomItems]);

  // Actions
  const toggleItemPurchased = useCallback(
    async (itemId: string) => {
      let nextPurchased = false;
      const nextItems = data.items.map((item) => {
        if (item.id === itemId) {
          nextPurchased = !item.purchased;
          return {
            ...item,
            purchased: nextPurchased,
            purchasedAt: nextPurchased ? new Date().toISOString() : undefined,
          };
        }
        return item;
      });

      const nextData = { ...data, items: nextItems };
      setData(nextData);
      await StorageService.saveData(nextData);
      await SupabaseService.toggleItemPurchased(itemId, nextPurchased);
    },
    [data]
  );

  const addItem = useCallback(
    async (item: Omit<FurnitureItem, 'id' | 'order' | 'purchased'>) => {
      const newItem: FurnitureItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        purchased: false,
        order: data.items.filter((i) => i.roomId === item.roomId).length,
      };

      const nextData = {
        ...data,
        items: [...data.items, newItem],
      };
      setData(nextData);
      await StorageService.saveData(nextData);
      await SupabaseService.addItem(newItem);
    },
    [data]
  );

  const updateItem = useCallback(
    async (item: FurnitureItem) => {
      const nextItems = data.items.map((i) => (i.id === item.id ? item : i));
      const nextData = { ...data, items: nextItems };
      setData(nextData);
      await StorageService.saveData(nextData);
      await SupabaseService.updateItem(item);
    },
    [data]
  );

  const deleteItem = useCallback(
    async (itemId: string) => {
      const nextItems = data.items.filter((i) => i.id !== itemId);
      const nextData = { ...data, items: nextItems };
      setData(nextData);
      await StorageService.saveData(nextData);
      await SupabaseService.deleteItem(itemId);
    },
    [data]
  );

  const addRoom = useCallback(
    async (name: string, description: string) => {
      const id = `room-${Date.now()}`;
      const newRoom: Room = {
        id,
        name,
        description,
        order: data.rooms.length,
      };
      const nextData = {
        ...data,
        rooms: [...data.rooms, newRoom],
      };
      setData(nextData);
      setSelectedRoomId(id);
      await StorageService.saveData(nextData);
      await SupabaseService.addRoom(newRoom);
    },
    [data]
  );

  const deleteRoom = useCallback(
    async (roomId: string) => {
      const nextRooms = data.rooms.filter((r) => r.id !== roomId);
      const nextItems = data.items.filter((i) => i.roomId !== roomId);
      const nextData = {
        ...data,
        rooms: nextRooms,
        items: nextItems,
      };

      setData(nextData);
      if (selectedRoomId === roomId) {
        setSelectedRoomId(nextRooms.length > 0 ? 'all' : '');
      }
      await StorageService.saveData(nextData);
      await SupabaseService.deleteRoom(roomId);
    },
    [data, selectedRoomId]
  );

  const updateBudget = useCallback(
    async (newBudget: number) => {
      const nextData = {
        ...data,
        totalBudget: newBudget,
      };
      setData(nextData);
      await StorageService.saveData(nextData);
      await SupabaseService.updateBudget(newBudget);
    },
    [data]
  );

  const getStatsForRoom = useCallback(
    (roomId: string) => {
      if (roomId === 'all') {
        const total = data.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
        const count = data.items.length;
        const bought = data.items.filter((i) => i.purchased).length;
        const percentage = count > 0 ? (bought / count) * 100 : 0;
        return { total, count, bought, percentage };
      }
      const items = data.items.filter((i) => i.roomId === roomId);
      const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
      const count = items.length;
      const bought = items.filter((i) => i.purchased).length;
      const percentage = count > 0 ? (bought / count) * 100 : 0;
      return { total, count, bought, percentage };
    },
    [data.items]
  );

  return {
    loading,
    data,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    roomItems,
    roomStats,
    stats,
    toggleItemPurchased,
    addItem,
    updateItem,
    deleteItem,
    addRoom,
    deleteRoom,
    updateBudget,
    getStatsForRoom,
    refreshData,
  };
}
