import TripleRingLoader from '@/components/TripleRingLoader';
import { addToFavorites, BASE_URL, removeFromFavorites } from '@/constants/constants';
import homeStyle from '@/styles/homeStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryGrid from '../components/home/CategoryGrid';
import HomeHeader from '../components/home/HomeHeader';
import HomeSlider from '../components/home/HomeSlider';
import ProductCard from '../components/home/ProductCard';
import ReviewSection from '../components/home/ReviewSection';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteStates, setFavoriteStates] = useState(products.map(() => false));
  const params = useLocalSearchParams();
  const selectedCategory = params.category;
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const toggleFavorite = async (productId: number, productPlatformId: number) => {
    const userIdStr = await AsyncStorage.getItem('user_id');
    if (!userIdStr) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng chức năng yêu thích.");
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
        Alert.alert("Thông báo", "Đã xoá khỏi yêu thích");
      } else {
        await addToFavorites(productId, userId, productPlatformId);
        setFavoriteIds((prev) => new Set(prev).add(productPlatformId));
        Alert.alert("Thông báo", "Đã thêm vào yêu thích");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xử lý yêu thích.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) return;

      const [resProduct, resFav] = await Promise.all([
        axios.get(`${BASE_URL}/api/products`),
        axios.get(`${BASE_URL}/favorites/user/${userId}`)
      ]);

      const favoriteIds = new Set(resFav.data.map((fav) => fav.product_platform_id));
      setFavoriteIds(favoriteIds);
      setProducts(resProduct.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Dữ liệu slider
  const sliderData = [
    {
      id: 1,
      image: require('../assets/images/adver.png'),
      title: 'adver pressed',
      link: ''
    },
    {
      id: 2,
      image: require('../assets/images/category.png'),
      title: 'Thời trang và phụ kiện',
      link: ''
    },
    {
      id: 3,
      image: require('../assets/images/comestic.png'),
      title: 'Mỹ phẩm',
      link: ''
    },
  ];

  const handleSliderItemPress = (item: any) => {
  };

  const handleToggleFavorite = (index) => {
    setFavoriteStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}
        style={homeStyle.container}
      >
        <HomeHeader />

        {/* Home Slider */}
        <HomeSlider
          data={sliderData}
          autoPlay={true}
          autoPlayInterval={4000}
          onItemPress={handleSliderItemPress}
        />

        <Text style={homeStyle.sectionTitle}>Danh mục phổ biến</Text>
        <CategoryGrid />

        {/* Khoảng cách giữa các section */}
        <View style={homeStyle.sectionSpacing} />
        <Text style={homeStyle.sectionTitle2}>Sản phẩm nổi bật</Text>
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
          <View style={{ flexDirection: 'row' }}>
            {products.slice(0, 12).map((item, index) => (
              <ProductCard
                key={`${item.productId}-${item.productPlatformId}`}
                productId={item.productId}
                productPlatformId={item.productPlatformId}
                productName={item.productName}
                platformLogo={item.platformLogo}
                productImage={item.productImage}
                currentPrice={item.currentPrice}
                originalPrice={item.originalPrice}
                discountPercentage={item.discountPercentage}
                shippingFee={item.shippingFee}
                totalPrice={item.totalPrice}
                isAvailable={item.isAvailable}
                rating={item.rating}
                productUrl={item.productUrl}
                isFavorite={favoriteIds.has(item.productPlatformId)}
                onToggleFavorite={() => toggleFavorite(item.productId, item.productPlatformId)}
              />
            ))}
          </View>
        </ScrollView> */}

        <FlatList
          data={products.slice(0, 15)}
          keyExtractor={(item) => `${item.productId}-${item.productPlatformId}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              productId={item.productId}
              productPlatformId={item.productPlatformId}
              productName={item.productName}
              platformLogo={item.platformLogo}
              productImage={item.productImage}
              currentPrice={item.currentPrice}
              originalPrice={item.originalPrice}
              discountPercentage={item.discountPercentage}
              shippingFee={item.shippingFee}
              totalPrice={item.totalPrice}
              isAvailable={item.isAvailable}
              rating={item.rating}
              productUrl={item.productUrl}
              isFavorite={favoriteIds.has(item.productPlatformId)}
              onToggleFavorite={() =>
                toggleFavorite(item.productId, item.productPlatformId)
              }
            />
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        {/* Khoảng cách giữa các section */}

        <ReviewSection />
      </ScrollView>
      <View style={homeStyle.sectionSpacing} />

    </SafeAreaView>
  );
}

