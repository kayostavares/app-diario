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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';

const LoginScreen = ({ onLogin, onRegister, onForgotPassword }) => {
  const { theme, isDark, toggleTheme } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.themeToggleBtn, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={20}
            color={isDark ? '#f5a623' : theme.primary}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { minHeight: height - (StatusBar.currentHeight || 0) - 60 },
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
              <Text style={[styles.title, { fontSize: width < 360 ? 22 : 26, color: theme.text }]}>
                Diário de Campo
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Entre na sua conta para continuar
              </Text>
            </View>

            <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>E-mail</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
                ]}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={[styles.label, { color: theme.textSecondary }]}>Senha</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
                ]}
                placeholder="Sua senha"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity onPress={onForgotPassword} style={styles.forgotButton}>
                <Text style={[styles.forgotText, { color: theme.primary }]}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.primary }]}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Entrar</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={[styles.text, { color: theme.textSecondary }]}>Não possui uma conta?</Text>
                <TouchableOpacity onPress={onRegister}>
                  <Text style={[styles.link, { color: theme.primary }]}>Cadastre-se</Text>
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  themeToggleBtn: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  headerBox: {
    marginBottom: 18,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 14,
  },
  formCard: {
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
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    paddingVertical: 4,
  },
  forgotText: {
    fontWeight: '600',
    fontSize: 13,
  },
  primaryButton: {
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
    fontSize: 14,
  },
  link: {
    fontWeight: '700',
    fontSize: 14,
  },
});