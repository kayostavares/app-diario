import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Image,
  useWindowDimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ onLogin, onRegister, onForgotPassword }) => {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logoSize = Math.min(Math.max(width * 0.28, 80), 140);

  const handleLogin = () => {
    Keyboard.dismiss();
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    onLogin({
      email: email.trim(),
      password,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { minHeight: height - (StatusBar.currentHeight || 0) },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerBox}>
              <Image
                source={require('../assets/icon.png')}
                style={{
                  width: logoSize,
                  height: logoSize,
                  marginBottom: height < 650 ? 4 : 10,
                }}
                resizeMode="contain"
              />
              <Text style={[styles.title, { fontSize: width < 360 ? 22 : 26 }]}>
                Diário de Campo
              </Text>
              <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity onPress={onForgotPassword} style={styles.forgotButton}>
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>Entrar</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.text}>Não possui uma conta?</Text>
                <TouchableOpacity onPress={onRegister}>
                  <Text style={styles.link}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  headerBox: {
    marginBottom: 18,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 15,
    color: '#222',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    paddingVertical: 4,
  },
  forgotText: {
    color: '#2f6fed',
    fontWeight: '600',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#2f6fed',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  text: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#2f6fed',
    fontWeight: '700',
    fontSize: 14,
  },
});