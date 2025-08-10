import { BASE_URL } from '@/constants/constants';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ImageSearchButtonProps {
  onSearchResults: (results: any[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function ImageSearchButton({ onSearchResults, onLoadingChange }: ImageSearchButtonProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isCameraPhoto, setIsCameraPhoto] = useState(false); // Thêm state để theo dõi loại ảnh

  const requestPermissions = async (type: 'library' | 'camera') => {
    if (type === 'library') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập',
          'Cần quyền truy cập thư viện ảnh để sử dụng tính năng này.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập',
          'Cần quyền truy cập camera để sử dụng tính năng này.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions('library');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9, // Tăng chất lượng ảnh từ thư viện
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setIsCameraPhoto(false); // Ảnh từ thư viện
        setShowImageModal(true);
        setShowOptionsModal(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1.0, // Tăng chất lượng ảnh chụp lên tối đa
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setIsCameraPhoto(true); // Ảnh chụp từ camera
        setShowImageModal(true);
        setShowOptionsModal(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
    }
  };

  const searchByImage = async () => {
    if (!selectedImage) return;

    try {
      onLoadingChange(true);
      setShowImageModal(false);

      // Tạo FormData để gửi ảnh
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'search_image.jpg',
      } as any);
      
      // Thêm tham số is_camera_photo
      formData.append('is_camera_photo', isCameraPhoto.toString());

      // Gọi API tìm kiếm bằng hình ảnh
      const response = await axios.post(`${BASE_URL}/search-by-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          is_camera_photo: isCameraPhoto // Gửi tham số qua query params
        }
      });

      if (response.data && response.data.results) {
        const results = response.data.results;
        
        onSearchResults(results);
        
        // Hiển thị thông báo chi tiết về chất lượng và xử lý
        let message = `Tìm thấy ${results.length} sản phẩm tương tự`;
        
        Alert.alert('Tìm kiếm thành công', message);
      } else {
        Alert.alert('Thông báo', 'Không tìm thấy sản phẩm tương tự với độ chính xác cao');
        onSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching by image:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm bằng hình ảnh. Vui lòng thử lại.');
      onSearchResults([]);
    } finally {
      onLoadingChange(false);
      setSelectedImage(null);
      setIsCameraPhoto(false);
    }
  };

  const cancelImageSearch = () => {
    setShowImageModal(false);
    setShowOptionsModal(false);
    setSelectedImage(null);
  };

  const openOptionsModal = () => {
    setShowOptionsModal(true);
  };

  return (
    <>
      <TouchableOpacity style={styles.imageSearchButton} onPress={openOptionsModal}>
        <FontAwesome name="camera" size={20} color="#007BFF" />
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelImageSearch}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phương thức</Text>
            
            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
              <FontAwesome name="photo" size={24} color="#007BFF" />
              <Text style={styles.optionText}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
              <FontAwesome name="camera" size={24} color="#007BFF" />
              <Text style={styles.optionText}>Chụp ảnh mới</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={cancelImageSearch}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelImageSearch}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tìm kiếm bằng hình ảnh</Text>
            
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={cancelImageSearch}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.searchButton} onPress={searchByImage}>
                <Text style={styles.searchButtonText}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  imageSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '600',
  },
  searchButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#007BFF',
  },
  searchButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
}); 