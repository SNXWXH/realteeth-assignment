import { useState, useEffect } from 'react';

type FavoriteLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  state?: string;
  addedAt: number;
};

const FAVORITES_STORAGE_KEY = 'weather_favorites';
const MAX_FAVORITES = 6;

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = (location: Omit<FavoriteLocation, 'id' | 'addedAt'>) => {
    if (favorites.length >= MAX_FAVORITES)
      throw new Error(
        `최대 ${MAX_FAVORITES}개까지만 즐겨찾기에 추가할 수 있습니다.`,
      );

    const newFavorite: FavoriteLocation = {
      ...location,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now(),
    };

    setFavorites((prev) => [...prev, newFavorite]);
    return newFavorite;
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const updateFavoriteName = (id: string, name: string) => {
    setFavorites((prev) =>
      prev.map((fav) => (fav.id === id ? { ...fav, name } : fav)),
    );
  };

  const isFavorite = (latitude: number, longitude: number): boolean => {
    return favorites.some(
      (fav) =>
        Math.abs(fav.latitude - latitude) < 0.001 &&
        Math.abs(fav.longitude - longitude) < 0.001,
    );
  };

  const getFavoriteByCoordinates = (
    latitude: number,
    longitude: number,
  ): FavoriteLocation | undefined => {
    return favorites.find(
      (fav) =>
        Math.abs(fav.latitude - latitude) < 0.001 &&
        Math.abs(fav.longitude - longitude) < 0.001,
    );
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateFavoriteName,
    isFavorite,
    getFavoriteByCoordinates,
    canAddMore: favorites.length < MAX_FAVORITES,
    count: favorites.length,
    maxCount: MAX_FAVORITES,
  };
};
