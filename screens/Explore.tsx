import RefreshWrapper from '@/components/RefreshWrapper';
import TripleRingLoader from '@/components/TripleRingLoader';
import CategoryFilterModal from '@/components/explore/CategoryFilterModal';
import CategorySuggestionGrid from '@/components/explore/CategorySuggestionGrid';
import EmptySearch from '@/components/explore/EmptySearch';
import ImageSearchButton from '@/components/explore/ImageSearchButton';
import PriceFilterModal from '@/components/explore/PriceFilterModal';
import ProductSearchCard from '@/components/explore/ProductSearchCard';
import { categories } from '@/constants/categories';
import { addToFavorites, BASE_URL, removeFromFavorites, search } from '@/constants/constants';
import { useFavorites } from '@/hooks/useFavorites';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import exploreStyle from '../styles/exploreStyle';

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
    product_name: string;
    image_url: string;
  };
  platform: {
    name: string;
    logo_url: string;
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
  const [imageSearchResults, setImageSearchResults] = useState<ResultItem[]>([]);
  const [isImageSearch, setIsImageSearch] = useState(false);
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
        setImageSearchResults([]);
        setIsImageSearch(false);
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

  const handleSearch = async () => {
    try {
      const userIdStr = await AsyncStorage.getItem('user_id');
      if (!userIdStr) {
        Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng chức năng tìm kiếm.");
        return;
      }

      const userId = parseInt(userIdStr);

      setLoading(true);
      setIsImageSearch(false);

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
            product_name: product.name,
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
      setImageSearchResults([]);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert("Lỗi", "Không thể tìm kiếm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearchResults = (imageResults: any[]) => {
    setIsImageSearch(true);
    
    // Chuyển đổi cấu trúc dữ liệu để tương thích với ResultItem
    const convertedResults: ResultItem[] = imageResults.map((item: any) => ({
      product_id: item.product_id,
      product_platform_id: item.product_platform_id,
      platform_id: item.platform_id,
      price: item.price,
      shipping_fee: item.shipping_fee,
      product_url: item.product_url,
      product: {
        image_url: item.product?.image_url || '',
        name: item.product?.name || '',
      },
      platform: {
        name: item.platform?.name || '',
      },
    }));
    
    setImageSearchResults(convertedResults);
    setResults([]);
  };

  const handleRefreshExplore = async () => {
    if (!categoryId) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/products/by-category/${categoryId}`);
      const data = await res.json();
      setProducts(data || []);
      setResults([]);
      setImageSearchResults([]);
      setIsImageSearch(false);
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
    platformName?: string,
    platformLogo?: string
  ) => (
    <ProductSearchCard
      key={`product-${productPlatformId}`}
      productId={productId}
      productPlatformId={productPlatformId}
      imageUrl={imageUrl}
      name={name}
      price={price}
      platformName={platformName}
      platformLogo={platformLogo}
      isFavorite={favoriteIds.has(productPlatformId)}
      onToggleFavorite={() => toggleFavorite(productId, productPlatformId)}
    />
  );

  // const displayProducts = results.length > 0
  //   ? results.map((item) =>
  //     renderProductCard(
  //       Number(item.product_id),
  //       Number(item.product_platform_id),
  //       item.product.image_url,
  //       item.product.product_name,
  //       item.price,
  //       item.platform.name,
  //     )

  //   )
  //   : products
  //     .filter((p) => p.price >= minPrice && p.price <= maxPrice)
  //     .map((p) =>
  //       renderProductCard(
  //         p.product_id,
  //         p.product_platform_id,
  //         p.image_url,
  //         p.name,
  //         p.price,
  //         p.platform,
  //       )
  //     );

  const displayProducts = () => {
    if (isImageSearch && imageSearchResults.length > 0) {
      // Áp dụng filter cho kết quả tìm kiếm bằng hình ảnh
      const filteredImageResults = imageSearchResults.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );
      return filteredImageResults.map((item) =>
        renderProductCard(
          Number(item.product_id),
          Number(item.product_platform_id),
          item.product.image_url,
          item.product.name || '',
          item.price,
          item.platform.name
        )
      );
    } else if (results.length > 0) {
      const filteredResults = results.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );
      return filteredResults.map((item) =>
        renderProductCard(
          Number(item.product_id),
          Number(item.product_platform_id),
          item.product.image_url,
          item.product.name || '',
          item.price,
          item.platform.name
        )
      );
    } else {
      return products
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
    }
  };

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
        <TouchableOpacity onPress={handleSearch} style={exploreStyle.searchButton}>
          <FontAwesome name="search" size={20} color="#007BFF" />
        </TouchableOpacity>
        <ImageSearchButton
          onSearchResults={handleImageSearchResults}
          onLoadingChange={setLoading}
        />
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

      {/* <RefreshWrapper onRefresh={handleRefreshExplore} style={{ paddingBottom: 100 }}>
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
      </RefreshWrapper> */}

       <RefreshWrapper onRefresh={handleRefreshExplore} style={{ paddingBottom: 100 }}>
        {/* Hiển thị thông báo kết quả */}
        {isImageSearch && imageSearchResults.length > 0 && (
          <Text style={exploreStyle.resultsText}>
            {imageSearchResults.filter((item) => item.price >= minPrice && item.price <= maxPrice).length} kết quả tìm kiếm bằng hình ảnh
          </Text>
        )}
        
        {searchText && results.length > 0 && (
          <Text style={exploreStyle.resultsText}>
            {results.filter((item) => item.price >= minPrice && item.price <= maxPrice).length} kết quả cho "{searchText}"
          </Text>
        )}

        {/* Hiển thị kết quả hoặc nội dung khác */}
        {(() => {
          // Kiểm tra kết quả tìm kiếm bằng hình ảnh
          if (isImageSearch && imageSearchResults.length > 0) {
            const filteredResults = imageSearchResults.filter(
              (item) => item.price >= minPrice && item.price <= maxPrice
            );
            if (filteredResults.length > 0) {
              return <View style={exploreStyle.productRow}>{displayProducts()}</View>;
            } else {
              return <EmptySearch />;
            }
          }
          
          // Kiểm tra kết quả tìm kiếm text
          if (searchText && results.length > 0) {
            const filteredResults = results.filter(
              (item) => item.price >= minPrice && item.price <= maxPrice
            );
            if (filteredResults.length > 0) {
              return <View style={exploreStyle.productRow}>{displayProducts()}</View>;
            } else {
              return <EmptySearch />;
            }
          }
          
          // Kiểm tra sản phẩm theo danh mục
          if (products.length > 0) {
            return <View style={exploreStyle.productRow}>{displayProducts()}</View>;
          }
          
          // Hiển thị CategorySuggestionGrid nếu không có gì
          return <CategorySuggestionGrid categories={categories} />;
        })()}
      </RefreshWrapper>
    </View>
  );
}
