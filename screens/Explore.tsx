import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { BASE_URL, search, addToFavorites, removeFromFavorites } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RefreshWrapper from '@/components/RefreshWrapper';
import axios from 'axios';
import TripleRingLoader from '@/components/TripleRingLoader';
import PriceFilterModal from '@/components/explore/PriceFilterModal';
import CategoryFilterModal from '@/components/explore/CategoryFilterModal';
import EmptySearch from '@/components/explore/EmptySearch';
import exploreStyle from '../styles/exploreStyle';
import ProductSearchCard from '@/components/explore/ProductSearchCard';
import CategorySuggestionGrid from '@/components/explore/CategorySuggestionGrid';
import { categories } from '@/constants/categories';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductItem {
  logo_url?: string;
  product_platform_id: number;
  product_id: number;
  name: string;
  image_url: string;
  price: number;
  platform: string;
}

type ResultItem = {
  product_id: number;
  product_platform_id: number;
  platform_id: number;
  price: number;
  shipping_fee: number;
  product_url: string;
  product: {
    image_url: string;
  };
  platform: {
    name: string;
  };
};

export default function Explore() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
  }>();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, label: string } | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const { favoriteIds, setFavoriteIds } = useFavorites();

  useEffect(() => {
    if (searchText.trim()) {
      handleSearch();
    }
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);

    setSelectedCategory({
      id: String(categoryId),
      label: categoryName || '',
    });

    fetch(`${BASE_URL}/products/by-category/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        setResults([]);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [categoryId, categoryName]);

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
        Alert.alert("Đã xoá khỏi yêu thích");
      } else {
        await addToFavorites(productId, userId, productPlatformId);
        setFavoriteIds((prev) => new Set(prev).add(productPlatformId));
        Alert.alert("Đã thêm vào yêu thích");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xử lý yêu thích.");
    }
  };

  const handleSearch = async () => {
    try {
      const userIdStr = await AsyncStorage.getItem('user_id');
      if (!userIdStr) {
        Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng chức năng tìm kiếm.");
        return;
      }

      const userId = parseInt(userIdStr);

      setLoading(true);

      // Gọi API tìm kiếm
      const res = await search(searchText);
      const data = res.data || [];

      // Gửi từ khóa vào Search History
      await axios.post(`${BASE_URL}/search-history/`, {
        query: searchText,
        user_id: userId,
      });

      // Hiển thị kết quả
      const allCards: ResultItem[] = data.flatMap((product) => {
        if (!product.product_platforms || product.product_platforms.length === 0) return [];

        return product.product_platforms.map((pf) => ({
          product_id: product.product_id,
          product_platform_id: pf.product_platform_id,
          platform_id: pf.platform.platform_id,
          price: pf.price,
          shipping_fee: pf.shipping_fee,
          product_url: pf.product_url,
          product: {
            image_url: product.image_url || '',
          },
          platform: {
            name: pf.platform.name || '',
          },
        }));
      });

      const filtered = allCards.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert("Lỗi", "Không thể tìm kiếm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshExplore = async () => {
    if (!categoryId) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/products/by-category/${categoryId}`);
      const data = await res.json();
      setProducts(data || []);
      setResults([]);
    } catch (err) {
      console.error("Refresh error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const renderProductCard = (
    productId: number,
    productPlatformId: number,
    imageUrl: string,
    name: string,
    price: number,
    platformName?: string
  ) => (
    <ProductSearchCard
      key={`product-${productPlatformId}`}
      productId={productId}
      productPlatformId={productPlatformId}
      imageUrl={imageUrl}
      name={name}
      price={price}
      platformName={platformName}
      isFavorite={favoriteIds.has(productPlatformId)}
      onToggleFavorite={() => toggleFavorite(productId, productPlatformId)}
    />
  );

  const displayProducts = results.length > 0
    ? results.map((item) =>
      renderProductCard(
        Number(item.product_id),
        Number(item.product_platform_id),
        item.product.image_url,
        '',
        item.price,
        item.platform.name
      )
    )
    : products
      .filter((p) => p.price >= minPrice && p.price <= maxPrice)
      .map((p) =>
        renderProductCard(
          p.product_id,
          p.product_platform_id,
          p.image_url,
          p.name,
          p.price,
          p.platform
        )
      );


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={exploreStyle.container}>
      <Text style={exploreStyle.pageTitle}>Danh mục: {categoryName}</Text>

      {/* Search input */}
      <View style={exploreStyle.searchContainer}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          placeholderTextColor={'#9C9C9C'}
          style={exploreStyle.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="#333" style={{ marginLeft: 8, color: '#007BFF' }} />
        </TouchableOpacity>
      </View>

      {/* Filter options */}
      <View style={exploreStyle.filterRow}>
        <TouchableOpacity style={exploreStyle.filterBox} onPress={() => setShowPriceFilter(true)}>
          <FontAwesome name="filter" size={16} color="#333" />
          <Text style={exploreStyle.filterText}>
            Giá từ {minPrice.toLocaleString()}đ đến {maxPrice.toLocaleString()}đ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={exploreStyle.filterBox} onPress={() => setShowCategoryFilter(true)}>
          <FontAwesome name="tags" size={16} color="#333" />
          <Text style={exploreStyle.filterText}>
            Danh mục: {selectedCategory ? selectedCategory.label : 'Chọn'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Price Filter Modal */}
      <PriceFilterModal
        visible={showPriceFilter}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChangeMin={setMinPrice}
        onChangeMax={setMaxPrice}
        onClose={() => setShowPriceFilter(false)}
        onApply={() => {
          setShowPriceFilter(false);
          if (searchText.trim()) {
            handleSearch();
          }
        }}
      />

      {/* Category Filter Modal */}
      <CategoryFilterModal
        visible={showCategoryFilter}
        categories={categories}
        selectedCategory={selectedCategory}
        onClose={() => setShowCategoryFilter(false)}
      />

      <RefreshWrapper onRefresh={handleRefreshExplore} style={{ paddingBottom: 100 }}>
        {searchText ? (
          <Text style={exploreStyle.resultsText}>{results.length} kết quả cho "{searchText}"</Text>
        ) : null}

        {searchText && results.length === 0 ? (
          <EmptySearch />

        ) : !searchText && results.length === 0 && products.length === 0 ? (
          <CategorySuggestionGrid categories={categories} />
        ) : (
          <View style={exploreStyle.productRow}>{displayProducts}</View>
        )}
      </RefreshWrapper>
    </View>
  );
}
