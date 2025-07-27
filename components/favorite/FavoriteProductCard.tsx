import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function FavoriteProductCard({
  item,
  isFavorite,
  onToggleFavorite,
}: {
  item: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const pf = item.product_platform;
  const total = pf.price + (pf.shipping_fee || 0);

  return (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: pf.platform.logo_url }} style={styles.platformLogo} />
        <Image source={{ uri: pf.product.image_url }} style={styles.image} />
      </View>

      <Text style={styles.cardTitle}>{pf.product.name}</Text>
      <Text style={styles.discount}>
        {pf.price.toLocaleString()}₫ - {pf.discount_percentage}%
      </Text>
      <Text style={styles.originalPrice}>
        {(pf.price + pf.discount).toLocaleString()}₫
      </Text>
      <Text style={styles.cardSubtitle}>Phí ship: {pf.shipping_fee?.toLocaleString() || 0}₫</Text>
      <Text style={styles.cardSubtitle}>Tổng: {total.toLocaleString()}₫</Text>
      <Text style={styles.status}>
        Trạng thái: <Text style={styles.statusValue}>Còn hàng</Text>
      </Text>
      <Text style={styles.cardSubtitle}>
        ⭐ {pf.rating} ({pf.review_count} đánh giá)
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.buyButtonFlex}
          onPress={() => Linking.openURL(pf.product_url)}
        >
          <FontAwesome name="shopping-cart" size={16} color="#fff" />
          <Text style={styles.buyButtonText}>Tới nơi bán</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.heartButton} onPress={onToggleFavorite}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 16,
    shadowColor: '#000',
    marginHorizontal: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  platformLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  discount: { color: 'red', fontWeight: 'bold' },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 5,
  },
  cardSubtitle: { fontSize: 14, color: '#555' },
  status: { marginBottom: 2, color: '#000' },
  statusValue: { fontWeight: 'bold', color: 'green' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  buyButtonFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  heartButton: {
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
