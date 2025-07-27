import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import exploreStyle from '@/styles/exploreStyle';

type Props = {
  productId: number;
  productPlatformId: number;
  imageUrl: string;
  name: string;
  price: number;
  platformName?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function ProductSearchCard({
  productId,
  productPlatformId,
  imageUrl,
  name,
  price,
  platformName,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <View key={`product-${productPlatformId}`} style={exploreStyle.card}>
      <Image source={{ uri: imageUrl }} style={exploreStyle.productImage} />
      <Text style={exploreStyle.productName}>{name}</Text>
      <Text style={exploreStyle.price}>{price.toLocaleString()} đ</Text>
      <Text style={exploreStyle.seller}>{platformName || name}</Text>

      <View style={exploreStyle.cardFooter}>
        <TouchableOpacity
          style={exploreStyle.compareButton}
          onPress={() =>
            router.push({
              pathname: '/compare',
              params: { productId: productId.toString() },
            })
          }
        >
          <FontAwesome name="exchange" size={14} color="#fff" />
          <Text style={exploreStyle.compareButtonText}>So sánh</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onToggleFavorite} style={exploreStyle.favoriteButton}>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={16}
            color={isFavorite ? 'red' : '#333'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
