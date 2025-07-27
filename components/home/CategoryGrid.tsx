import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import homeStyle from '@/styles/homeStyle';

const categories = [
    {
        id: 1,
        label: 'Thời trang & Phụ kiện',
        img: require('../../assets/images/category.png'),
    },
    {
        id: 2,
        label: 'Mỹ phẩm & Làm đẹp',
        img: require('../../assets/images/comestic.png'),
    },
    {
        id: 3,
        label: 'Điện thoại di động',
        img: require('../../assets/images/dienthoaididong.jpg'),
    },
    {
        id: 4,
        label: 'Laptop & Tablet',
        img: require('../../assets/images/laptopmaytinhbang.png'),
    },
    {
        id: 5,
        label: 'Thiết bị thể thao',
        img: require('../../assets/images/thietbithethao.png'),
    },
    {
        id: 6,
        label: 'Đồ dùng học tập',
        img: require('../../assets/images/dodunghoctap.png'),
    },
];

export default function CategoryGrid() {
    return (
        <View style={homeStyle.categoryGrid}>
            {categories.map((cat) => (
                <TouchableOpacity
                    key={`category-${cat.id}`}
                    style={homeStyle.categoryGridItem}
                    onPress={() => {
                        router.push({
                            pathname: "/drawer/explore",
                            params: {
                                categoryId: cat.id.toString(),
                                categoryName: cat.label
                            }
                        });
                    }}
                >
                    <View style={homeStyle.categoryGridInner}>
                        <View style={homeStyle.categoryGridImage}>
                            <Image source={cat.img} style={homeStyle.categoryGridImageContent} />
                        </View>
                        <View style={homeStyle.categoryGridTitle}>
                            <Text style={homeStyle.categoryGridTitleText}>{cat.label}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}
