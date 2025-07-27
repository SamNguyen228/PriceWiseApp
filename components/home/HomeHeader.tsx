import React from 'react';
import { View, Text, Image } from 'react-native';
import homeStyle from '@/styles/homeStyle';

export default function HomeHeader() {
    return (
        <View style={homeStyle.header}>
            <Text style={homeStyle.headerTitle}>Trang chủ</Text>
            <Image source={require('../../assets/images/logo.png')} style={homeStyle.logoContainer} />
        </View>
    );
}

