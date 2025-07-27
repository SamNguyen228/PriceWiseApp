import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import exploreStyle from '@/styles/exploreStyle';

export default function EmptySearch() {
  return (
    <View style={exploreStyle.emptyWrapper}>
      <View style={exploreStyle.emptyContent}>
        <FontAwesome name="search" size={64} color="#999" />
        <Text style={exploreStyle.emptyText}>Không tìm thấy kết quả nào</Text>
      </View>
    </View>
  );
}

