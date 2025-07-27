import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@/constants/constants';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userIdStr = await AsyncStorage.getItem('user_id');
        if (!userIdStr) return;

        const userId = parseInt(userIdStr);
        const res = await axios.get(`${BASE_URL}/favorites/user/${userId}`);
        const data = res.data;

        const favIds = new Set(data.map((f: any) => f.product_platform_id));
        setFavoriteIds(favIds);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm yêu thích:', error);
      }
    };

    fetchFavorites();
  }, []);

  return { favoriteIds, setFavoriteIds };
}
