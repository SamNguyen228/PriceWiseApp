import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import homeStyle from '@/styles/homeStyle';

const reviews = [
    {
        name: 'Minh Choco',
        avatar: require('../../assets/images/avatar.png'),
        stars: 5,
        comment: 'Ứng dụng xịn sò dễ dùng cực luôn!',
    },
    {
        name: 'Thảo Milk',
        avatar: require('../../assets/images/cat.jpg'),
        stars: 4,
        comment: 'Giao diện cute quá trời luôn, mỗi tội hơi lag tí.',
    },
    {
        name: 'Tuấn Dev',
        avatar: require('../../assets/images/cat1.jpg'),
        stars: 5,
        comment: 'Quá tuyệt vời, tìm sản phẩm nhanh lẹ. Rất recommend!',
    },
    {
        name: 'Hà Lười',
        avatar: require('../../assets/images/dog1.jpg'),
        stars: 3,
        comment: 'Tạm ổn nha, giao diện đẹp nhưng cần thêm sản phẩm ',
    },
    {
        name: 'Trang Mèo',
        avatar: require('../../assets/images/dog2.jpg'),
        stars: 5,
        comment: 'App đáng yêu như chính tui vậy. Dùng là nghiện!',
    },
];

export default function ReviewSection() {
    return (
        <View style={homeStyle.userReviewsContainer}>
            <View style={homeStyle.sectionSpacing} />
            <Text style={homeStyle.ratingTitle}>Đánh giá từ người dùng</Text>
            {reviews.map((user, index) => (
                <View key={index} style={homeStyle.reviewItem}>
                    <Image source={user.avatar} style={homeStyle.reviewAvatar} />
                    <View style={homeStyle.reviewContent}>
                        <Text style={homeStyle.reviewerName}>{user.name}</Text>
                        <View style={homeStyle.starsRow}>
                            {[...Array(user.stars)].map((_, i) => (
                                <FontAwesome key={i} name="star" size={16} color="#FFD700" />
                            ))}
                        </View>
                        <Text style={homeStyle.reviewText}>{user.comment}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}
