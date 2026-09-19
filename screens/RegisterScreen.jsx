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

const RegisterScreen = ({
  onRegister,
  onBack,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Atenção',
        'As senhas não coincidem.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Atenção',
        'A senha deve possuir pelo menos 6 caracteres.'
      );
      return;
    }

    onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Criar conta
        </Text>

        <Text style={styles.subtitle}>
          Cadastre-se no Diário de Campo
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRegister}
        >
          <Text style={styles.primaryButtonText}>
            Criar conta
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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

  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
  },

  backText: {
    color: '#2f6fed',
    fontWeight: '600',
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

  primaryButton: {
    backgroundColor: '#2f6fed',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});