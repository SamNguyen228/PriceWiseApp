import TripleRingLoader from '@/components/TripleRingLoader';
import { BASE_URL } from '@/constants/constants';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignInScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true
  });

  // Cấu hình OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: Constants.expoConfig.extra.expoClientId,
    androidClientId: Constants.expoConfig.extra.androidClientId,
    iosClientId: Constants.expoConfig.extra.iosClientId,
    scopes: ['profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  const handleComingSoon = () => {
    Alert.alert("Thông báo", "Tính năng đang phát triển");
  };

  useEffect(() => {
    const loadRemembered = async () => {
      const savedEmail = await AsyncStorage.getItem('remember_email');
      const savedPassword = await AsyncStorage.getItem('remember_password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    };
    loadRemembered();
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        router.replace('/drawer/home');
      }
    };
    checkLogin();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Lỗi đăng nhập");
      }

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('user_id', data.user.id.toString());

        if (rememberMe) {
          await AsyncStorage.setItem('remember_email', email);
          await AsyncStorage.setItem('remember_password', password);
        } else {
          await AsyncStorage.removeItem('remember_email');
          await AsyncStorage.removeItem('remember_password');
        }

        Alert.alert("Đăng nhập thành công", `Chào ${data.user.username}!`, [
          { text: "OK", onPress: () => router.replace('/drawer/home') }
        ]);
      }

    } catch (err) {
      const error = err as Error;
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication!;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/login/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_token: idToken })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Đăng nhập Google thất bại");
      }

      const data = await res.json();
      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('user_id', data.user.id.toString());

      Alert.alert("Đăng nhập thành công", `Chào ${data.user.username}!`, [
        { text: "OK", onPress: () => router.replace('/drawer/home') }
      ]);
    } catch (err) {
      Alert.alert("Lỗi", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang xác thực...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ Email"
        placeholderTextColor="#333"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#333"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.icon}
        >
          <FontAwesome
            name={passwordVisible ? 'eye-slash' : 'eye'}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.rememberMeGroup} onPress={() => setRememberMe(!rememberMe)}>
          <FontAwesome
            name={rememberMe ? 'check-square' : 'square-o'}
            size={20}
            style={styles.checkbox}
          />
          <Text style={styles.optionText}>Ghi nhớ đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forgot')}>
          <Text style={styles.optionText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <Text style={styles.socialText}>hoặc bạn có thể đăng nhập bằng</Text>

      <View style={styles.separator} />

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton} onPress={handleComingSoon}>
          <FontAwesome name="apple" size={40} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
          <FontAwesome name="google" size={40} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleComingSoon}>
          <FontAwesome name="facebook" size={40} color="#3b5998" />
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={[styles.signupText, { fontWeight: 'bold', color: '#007BFF' }]}>
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    paddingTop: 90,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  button: {
    backgroundColor: '#D17842',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  socialText: {
    marginTop: 15,
    fontSize: 14,
    color: '#444',
    textAlign: 'center'
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 10
  },
  socialButtons: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  checkbox: {
    marginRight: 5,
    color: '#D17842'
  },
  rememberMeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#007BFF',
  },
  optionText: {
    fontSize: 14,
    color: '#D17842',
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
});
