import exploreStyle from '@/styles/exploreStyle';
import { router } from 'expo-router';
import { Button, Modal, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  categories: { id: string; label: string }[];
  selectedCategory: { id: string; label: string } | null;
  onClose: () => void;
};

export default function CategoryFilterModal({
  visible,
  categories,
  selectedCategory,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={exploreStyle.modalContainer}>
        <View style={exploreStyle.modalContent}>
          <Text style={exploreStyle.modalTitle}>Chọn danh mục</Text>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                exploreStyle.categoryOption,
                selectedCategory?.id === cat.id && exploreStyle.selectedCategory,
              ]}
              onPress={() => {
                router.push({
                  pathname: '/drawer/explore',
                  params: { categoryId: cat.id, categoryName: cat.label },
                });
                onClose();
              }}
            >
              <Text
                style={[
                  exploreStyle.categoryText,
                  selectedCategory?.id === cat.id && exploreStyle.selectedText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
          <Button title="Đóng" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

