import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BASE_URL } from "@/constants/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import TripleRingLoader from "@/components/TripleRingLoader";
import compareStyle from "../styles/compareStyle"

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
        const colors = ["#fff0f3", "#e0f7ff", "#f3f0ff"];
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
      });
  }, [productId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff8fc" }}>
      <ScrollView style={compareStyle.container}>
        <Text style={compareStyle.title}>So sánh sản phẩm trên các sàn</Text>

        <View style={compareStyle.cardContainer}>
          {productData.map((item, index) => (
            <View
              key={index}
              style={[compareStyle.productCard, { backgroundColor: item.color }]}
            >
              <Text style={compareStyle.platformBadge}>{item.platform}</Text>
              <Image
                source={{ uri: item.image_url }}
                style={compareStyle.productImage}
              />
              {item.logo_url ? (
                <Image
                  source={{ uri: item.logo_url }}
                  style={compareStyle.platformLogo}
                />
              ) : (
                <Text>No Logo</Text>
              )}
              <Text style={compareStyle.price}>{item.price.toLocaleString()} đ</Text>
              <TouchableOpacity
                style={compareStyle.buyButton}
                onPress={() => Linking.openURL(item.product_url)}
              >
                <Text style={compareStyle.buyButtonText}>🛒 Xem ngay</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bảng so sánh */}
        <Text style={compareStyle.sectionTitle}>Bảng so sánh</Text>
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
            [
              "Giá bán",
              (item: PlatformData) => `${item.price.toLocaleString()} đ`,
            ],
            [
              "Giảm giá",
              (item: PlatformData) => `${item.discount.toLocaleString()} đ`,
            ],
            ["% KM", (item: PlatformData) => `${item.discount_percentage}%`],
            ["Đánh giá", (item: PlatformData) => `${item.rating}`],
            ["Lượt đánh giá", (item: PlatformData) => `${item.review_count}`],
            [
              "Phí ship",
              (item: PlatformData) =>
                item.shipping_fee === 0
                  ? "Miễn phí"
                  : `${item.shipping_fee.toLocaleString()} đ`,
            ],
            ["Giao hàng", (item: PlatformData) => item.estimated_delivery_time],
            [
              "Chính hãng",
              (item: PlatformData) => (item.is_official ? "✅" : "❌"),
            ],
          ].map(([label, getValue], idx) => (
            <View key={idx} style={compareStyle.tableRow}>
              <Text style={compareStyle.labelCell}>{label}</Text>
              {productData.map((item, i) => (
                <Text key={i} style={compareStyle.valueCell}>
                  {getValue(item)}
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
