// components/EmptyState.tsx
import { Text, View, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function EmptyFavorite() {
  return (
    <View style={styles.overlayEmpty}>
      <View style={styles.heartBox}>
        <View style={styles.heartIcon}>
          <Image
            source={require('../../assets/images/heart_icon.jpg')}
            style={{ width: 70, height: 70, resizeMode: 'contain' }}
          />
        </View>
        <Text style={styles.heartText}>Sản phẩm yêu thích</Text>
      </View>

      <Text style={styles.messageText}>
        Hiện tại chưa có sản phẩm, hãy cùng{' '}
        <Text
          style={styles.link}
          onPress={() => router.push('/drawer/explore')}
        >
          Khám phá
        </Text>{' '}
        các sản phẩm
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayEmpty: {
    flex: 1,
    marginTop: '40%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heartBox: {
    backgroundColor: '#EAAE99',
    padding: 50,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: '22%',
  },
  heartIcon: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginBottom: 10,
  },
  heartText: {
    marginTop: 10,
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: 'black',
  },
});
