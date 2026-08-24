import AsyncStorage from '@react-native-async-storage/async-storage';
import { FurnitureItem, HouseData, Room } from '@/types/house';

const STORAGE_KEY = '@my_house_app_data_v1';

export const INITIAL_ROOMS: Room[] = [];

export const INITIAL_ITEMS: FurnitureItem[] = [];

export const INITIAL_DATA: HouseData = {
  totalBudget: 0,
  rooms: INITIAL_ROOMS,
  items: INITIAL_ITEMS,
};

export const StorageService = {
  async loadData(): Promise<HouseData> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await this.saveData(INITIAL_DATA);
      return INITIAL_DATA;
    } catch (e) {
      console.warn('Erro ao carregar dados locais, usando padrão:', e);
      return INITIAL_DATA;
    }
  },

  async saveData(data: HouseData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar dados locais:', e);
    }
  },

  async resetData(): Promise<HouseData> {
    await this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  },
};
