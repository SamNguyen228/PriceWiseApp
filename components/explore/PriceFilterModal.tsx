import { Modal, View, Text, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import exploreStyle from '../../styles/exploreStyle';

type Props = {
  visible: boolean;
  minPrice: number;
  maxPrice: number;
  onChangeMin: (val: number) => void;
  onChangeMax: (val: number) => void;
  onClose: () => void;
  onApply: () => void;
};

export default function PriceFilterModal({
  visible,
  minPrice,
  maxPrice,
  onChangeMin,
  onChangeMax,
  onClose,
  onApply,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={exploreStyle.modalContainer}>
        <View style={exploreStyle.modalContent}>
          <Text style={exploreStyle.modalTitle}>Chọn khoảng giá</Text>
          <Text>Giá từ: {minPrice.toLocaleString()} đ</Text>
          <Slider
            minimumValue={0}
            maximumValue={50000000}
            step={1000000}
            value={minPrice}
            onValueChange={onChangeMin}
          />
          <Text>Đến: {maxPrice.toLocaleString()} đ</Text>
          <Slider
            minimumValue={0}
            maximumValue={50000000}
            step={1000000}
            value={maxPrice}
            onValueChange={onChangeMax}
          />
          <View style={{margin: 6}}></View>
          <Button title="Áp dụng" onPress={onApply} />
          <View style={{margin: 6}}></View>
          <Button title="Đóng" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

