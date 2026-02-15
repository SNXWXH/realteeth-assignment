export type FavoriteLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  state?: string;
  addedAt: number;
};
