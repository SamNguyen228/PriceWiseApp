import EmptyFavorite from '@/components/favorite/EmptyFavorite';
import FavoriteProductCard from '@/components/favorite/FavoriteProductCard';
import TripleRingLoader from "@/components/TripleRingLoader";
import { addToFavorites, BASE_URL, removeFromFavorites } from "@/constants/constants";
import favoriteStyle from "@/styles/favoriteStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FavoriteProduct {
  favorite_id: number;
  user_id: number;
  product_platform_id: number;
  added_at: string;
  product_platform: {
    price: number;
    discount: number;
    discount_percentage: number;
    shipping_fee: number;
    rating: number;
    review_count: number;
    product_url: string;
    is_official: boolean;
    platform: {
      name: string;
      logo_url: string;
    };
    product: {
      product_id: number;
      name: string;
      image_url: string;
    };
  };
}

export default function Favorite() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const handleTabPress = (label: string) => {
    navigation.navigate(label as never);
  };

  useEffect(() => {
    const fetchUserIdAndFavorites = async () => {
      try {
        const userIdString = await AsyncStorage.getItem("user_id");
        if (!userIdString) {
          console.warn("Không tìm thấy user_id trong AsyncStorage");
          setLoading(false);
          return;
        }

        const userId = parseInt(userIdString);
        const response = await fetch(`${BASE_URL}/favorites/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setFavorites(data);
          const ids = new Set(data.map((item) => item.product_platform_id));
          setFavoriteIds(ids);
        } else {
          console.error("API lỗi:", response.status, data);
        }
      } catch (error) {
        console.error("Lỗi fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndFavorites();
  }, []);

  const toggleFavorite = async (
    productId: number,
    productPlatformId: number
  ) => {
    const userIdStr = await AsyncStorage.getItem("user_id");
    if (!userIdStr) {
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để sử dụng chức năng yêu thích."
      );
      return;
    }

    const userId = parseInt(userIdStr);
    const isFav = favoriteIds.has(productPlatformId);

    try {
      if (isFav) {
        await removeFromFavorites(productId, userId, productPlatformId);
        setFavoriteIds((prev) => {
          const updated = new Set(prev);
          updated.delete(productPlatformId);
          return updated;
        });
        setFavorites((prev) =>
          prev.filter((f) => f.product_platform_id !== productPlatformId)
        );
        Alert.alert("Thông Báo", "Đã xoá khỏi yêu thích");
      } else {
        await addToFavorites(productId, userId, productPlatformId);
        setFavoriteIds((prev) => new Set(prev).add(productPlatformId));
        Alert.alert("Thông Báo", "Đã thêm vào yêu thích");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xử lý yêu thích.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[favoriteStyle.container, favorites.length > 0 && favoriteStyle.whiteBackground]}
    >
      {favorites.length === 0 ? (
        <EmptyFavorite />
      ) : (
        // <ScrollView contentContainerStyle={favoriteStyle.scrollContent}>
        //   <View style={favoriteStyle.fullWidthCenter}>
        //     <Text style={favoriteStyle.resultTitle}>Danh sách sản phẩm yêu thích</Text>
        //   </View>
        //   <View style={favoriteStyle.rowWrap}>
        //     {favorites.map((item) => (
        //       <FavoriteProductCard
        //         key={item.favorite_id}
        //         item={item}
        //         isFavorite={favoriteIds.has(item.product_platform_id)}
        //         onToggleFavorite={() =>
        //           toggleFavorite(
        //             item.product_platform.product.product_id,
        //             item.product_platform_id
        //           )
        //         }
        //       />
        //     ))}
        //   </View>
        // </ScrollView>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.favorite_id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
          contentContainerStyle={favoriteStyle.scrollContent}
          ListHeaderComponent={() => (
            <View style={favoriteStyle.fullWidthCenter}>
              <Text style={favoriteStyle.resultTitle}>Danh sách sản phẩm yêu thích</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <FavoriteProductCard
              item={item}
              isFavorite={favoriteIds.has(item.product_platform_id)}
              onToggleFavorite={() =>
                toggleFavorite(
                  item.product_platform.product.product_id,
                  item.product_platform_id
                )
              }
            />
          )}
        />

      )}
    </SafeAreaView>
  );
}

