import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
       Chào mừng đến với <Text style={styles.bold}>PriceWise</Text>
      </Text>

      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push('/signin')} 
      >
        <Text style={styles.signInText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push('/signup')} 
      >
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  logo: {
    width: 200, 
    height: 200,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#D19A6A', 
    padding: 15,
    borderRadius: 10, 
    marginVertical: 10,
    width: '80%', 
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10, 
    marginVertical: 10,
    width: '80%', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D19A6A',
  },
  signInText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#D19A6A', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});