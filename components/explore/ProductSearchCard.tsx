import exploreStyle from '@/styles/exploreStyle';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  productId: number;
  productPlatformId: number;
  imageUrl: string;
  name: string;
  price: number;
  platformName?: string;
  platformLogo?: string;
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
  platformLogo,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <View key={`product-${productPlatformId}`} style={exploreStyle.card}>
      {/* Nội dung chính */}
      <View style={{ alignItems: 'center' }}>
        <Image source={{ uri: imageUrl }} style={exploreStyle.productImage} />
        <Text style={exploreStyle.productName} numberOfLines={1}>{name}</Text>
        <Text style={exploreStyle.price}>{price.toLocaleString()} đ</Text>
        <Text style={exploreStyle.seller}>{platformName || name}</Text>
      </View>

      {/* Footer luôn nằm ở cuối */}
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
