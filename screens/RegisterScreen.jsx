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
import { useTheme } from '../styles/theme';

const RegisterScreen = ({ onRegister, onBack }) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const logoSize = Math.min(Math.max(width * 0.22, 65), 100);

  const handleRegister = () => {
    Keyboard.dismiss();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve possuir pelo menos 6 caracteres.');
      return;
    }

    onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
          >
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={[styles.backText, { color: theme.primary }]}>← Voltar</Text>
            </TouchableOpacity>

            <View style={styles.headerBox}>
              <Image
                source={require('../assets/icon.png')}
                style={{
                  width: logoSize,
                  height: logoSize,
                  marginBottom: 6,
                }}
                resizeMode="contain"
              />
              <Text style={[styles.title, { fontSize: width < 360 ? 20 : 24, color: theme.text }]}>
                Criar conta
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Cadastre-se no Diário de Campo
              </Text>
            </View>

            <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Nome Completo</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
                ]}
                placeholder="Ex: João da Silva"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />

              <Text style={[styles.label, { color: theme.textSecondary }]}>E-mail</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
                ]}
                placeholder="Ex: joao@campo.com"
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
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Text style={[styles.label, { color: theme.textSecondary }]}>Confirmar Senha</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
                ]}
                placeholder="Repita sua senha"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.primary }]}
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  backText: {
    fontWeight: '700',
    fontSize: 15,
  },
  headerBox: {
    marginBottom: 14,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 3,
    fontSize: 13,
  },
  formCard: {
    padding: 20,
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
    paddingVertical: 11,
    marginBottom: 12,
    fontSize: 15,
  },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});