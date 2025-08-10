import TripleRingLoader from "@/components/TripleRingLoader";
import { BASE_URL } from "@/constants/constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import compareStyle from "../styles/compareStyle";

interface PlatformData {
  platform: string;
  logo_url: string;
  price: number;
  discount: number;
  discount_percentage: number;
  rating: number;
  review_count: number;
  shipping_fee: number;
  estimated_delivery_time: string;
  is_official: boolean;
  product_url: string;
  image_url: string;
  color?: string;
}

export default function CompareProductScreen() {
  const [productData, setProductData] = useState<PlatformData[]>([]);
  const { productId } = useLocalSearchParams<{ productId?: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    fetch(`${BASE_URL}/products/${productId}/compare`)
      .then((res) => res.json())
      .then((data) => {
        // Cải thiện màu sắc với gradient cam
        const colors = ["#FFF8F0", "#FFF0E6", "#FFE8D6"];
        const coloredData = data.map((item: PlatformData, index: number) => ({
          ...item,
          color: colors[index % colors.length],
        }));

        setProductData(coloredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProductData([]);
        Alert.alert("Lỗi", "Không thể tải dữ liệu so sánh. Vui lòng thử lại.");
      });
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TripleRingLoader />
          <Text style={{ marginTop: 15, fontSize: 16, color: "#FF6B35" }}>
            Đang tải dữ liệu so sánh...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (productData.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, color: "#FF6B35", textAlign: "center", marginBottom: 10 }}>
            Không có dữ liệu so sánh
          </Text>
          <Text style={{ fontSize: 14, color: "#6c757d", textAlign: "center" }}>
            Không thể tải thông tin so sánh sản phẩm
          </Text>
          <TouchableOpacity
            style={[compareStyle.backButton, { marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={compareStyle.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView style={compareStyle.container}>
        <Text style={compareStyle.title}>So sánh sản phẩm trên các sàn</Text>

        {/* Cải thiện thanh hiển thị ảnh */}
        <View style={compareStyle.cardContainer}>
          {productData.map((item, index) => (
            <View
              key={index}
              style={[compareStyle.productCard, { backgroundColor: item.color }]}
            >
              <Text style={compareStyle.platformBadge}>{item.platform}</Text>

              {/* Cải thiện hiển thị ảnh sản phẩm */}
              <View style={{
                width: 90,
                height: 90,
                backgroundColor: '#fff',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}>
                <Image
                  source={{ uri: item.image_url }}
                  style={compareStyle.productImage}
                  defaultSource={require('../assets/images/icon.png')}
                />
              </View>

              {/* Cải thiện hiển thị logo platform */}
              {item.logo_url ? (
                <View style={{
                  backgroundColor: '#fff',
                  paddingHorizontal: 0, 
                  paddingVertical: 0, 
                  borderRadius: 3,
                  marginBottom: 8,
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: 18, 
                  maxHeight: 18, 
                  width: 20, 
                  overflow: 'hidden', 
                }}>
                  <Image
                    source={{ uri: item.logo_url }}
                    style={compareStyle.platformLogo}
                    resizeMode="contain" 
                  />
                </View>
              ) : (
                <Text style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>No Logo</Text>
              )}

              <Text style={compareStyle.price} numberOfLines={1}>
                {item.price.toLocaleString()} đ
              </Text>

              {/* Cải thiện nút mua */}
              <TouchableOpacity
                style={compareStyle.buyButton}
                onPress={() => {
                  try {
                    Linking.openURL(item.product_url);
                  } catch (error) {
                    Alert.alert("Lỗi", "Không thể mở liên kết sản phẩm");
                  }
                }}
              >
                <Text style={compareStyle.buyButtonText}>Xem ngay</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bảng so sánh */}
        <Text style={compareStyle.sectionTitle}>Bảng so sánh chi tiết</Text>
        <View style={compareStyle.table}>
          {/* Header */}
          <View style={[compareStyle.tableRow, compareStyle.tableHeader]}>
            <Text style={compareStyle.labelCell}>Tiêu chí</Text>
            {productData.map((item, i) => (
              <Text key={i} style={compareStyle.valueCellHeader}>
                {item.platform}
              </Text>
            ))}
          </View>

          {/* Các dòng so sánh */}
          {[
            {
              label: "Giá bán",
              getValue: (item: PlatformData) => `${item.price.toLocaleString()} đ`,
            },
            {
              label: "Giảm giá",
              getValue: (item: PlatformData) => `${item.discount.toLocaleString()} đ`,
            },
            {
              label: "% KM",
              getValue: (item: PlatformData) => `${item.discount_percentage}%`,
            },
            {
              label: "Đánh giá",
              getValue: (item: PlatformData) => `${item.rating} ⭐`,
            },
            {
              label: "Lượt đánh giá",
              getValue: (item: PlatformData) => `${item.review_count.toLocaleString()}`,
            },
            {
              label: "Phí ship",
              getValue: (item: PlatformData) =>
                item.shipping_fee === 0
                  ? "Miễn phí 🚚"
                  : `${item.shipping_fee.toLocaleString()} đ`,
            },
            {
              label: "Giao hàng",
              getValue: (item: PlatformData) => item.estimated_delivery_time,
            },
            {
              label: "Chính hãng",
              getValue: (item: PlatformData) => (item.is_official ? "✅ Có" : "❌ Không"),
            },
          ].map((row, idx) => (
            <View key={idx} style={compareStyle.tableRow}>
              <Text style={compareStyle.labelCell}>{row.label}</Text>
              {productData.map((item, i) => (
                <Text key={i} style={compareStyle.valueCell} numberOfLines={1}>
                  {row.getValue(item)}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={compareStyle.backButton}
          onPress={() => router.back()}
        >
          <Text style={compareStyle.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}