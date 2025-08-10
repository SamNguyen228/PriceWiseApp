import homeStyle from '@/styles/homeStyle';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ProductCardProps {
  productId: number;
  productPlatformId: number;
  productName: string;
  platformLogo: string;
  productImage: string;
  currentPrice: string;
  originalPrice: string;
  discountPercentage: string;
  shippingFee: string;
  totalPrice: string;
  isAvailable: boolean;
  rating: string;
  productUrl: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  productPlatformId,
  productName,
  platformLogo,
  productImage,
  currentPrice,
  originalPrice,
  discountPercentage,
  shippingFee,
  totalPrice,
  isAvailable,
  rating,
  productUrl,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <View style={homeStyle.card}>
      {/* Top Icons */}
      <View style={homeStyle.topIcons}>
        <Image source={{ uri: platformLogo }} style={homeStyle.logo1} />

        <TouchableOpacity onPress={onToggleFavorite} style={homeStyle.favouriteButton}>
          <Ionicons
          style={{color:'red'}}
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
        
      </View>

      {/* Image Section */}
      <Image source={{ uri: productImage }} style={homeStyle.image} />

      {/* Product Name */}
      <Text style={homeStyle.productName}>{productName}</Text>

      {/* Price Section */}
      <Text style={homeStyle.currentPrice}>{currentPrice}</Text>
      <View style={homeStyle.priceContainer}>
        <Text style={homeStyle.originalPrice}>{originalPrice}</Text>
        <Text style={homeStyle.discount}>{discountPercentage}</Text>
      </View>

      {/* Details Section */}
      <View style={homeStyle.details}>
        <Text>Phí VC: {shippingFee}</Text>
        <Text>Tổng: {totalPrice}</Text>
        <Text style={homeStyle.status}>
          Trạng thái: <Text style={[homeStyle.statusValue, { color: isAvailable ? 'green' : 'red' }]}>
            {isAvailable ? 'Còn hàng' : 'Hết hàng'}
          </Text>
        </Text>
        <Text style={homeStyle.rating}>⭐ {rating}</Text>
      </View>

      {/* Nút mua và nút yêu thích */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <TouchableOpacity style={homeStyle.buyButton} onPress={() => Linking.openURL(productUrl)}>
          <Icon name="shopping-cart" size={18} color="white" style={homeStyle.cartIcon} />
          <Text style={homeStyle.buyButtonText}>Tới nơi bán</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default ProductCard;