import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const LoginScreen = ({
  onLogin,
  onRegister,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>
          Diário de Campo
        </Text>

        <Text style={styles.subtitle}>
          Entre na sua conta
        </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={onForgotPassword}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotText}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>
            Entrar
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.text}>
            Não possui uma conta?
          </Text>

          <TouchableOpacity onPress={onRegister}>
            <Text style={styles.link}>
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  forgotButton: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },

  forgotText: {
    color: '#2f6fed',
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: '#2f6fed',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 5,
  },

  text: {
    color: '#666',
  },

  link: {
    color: '#2f6fed',
    fontWeight: '700',
  },
});