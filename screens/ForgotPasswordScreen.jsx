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

const ForgotPasswordScreen = ({
  onSendReset,
  onBack,
}) => {
  const [email, setEmail] = useState('');

  const handleSendReset = () => {
    if (!email.trim()) {
      Alert.alert(
        'Atenção',
        'Digite seu e-mail.'
      );
      return;
    }

    onSendReset(email.trim());
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
          Esqueceu a senha?
        </Text>

        <Text style={styles.subtitle}>
          Informe seu e-mail para recuperar o acesso
        </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSendReset}
        >
          <Text style={styles.primaryButtonText}>
            Recuperar senha
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

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
    fontSize: 26,
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
    marginBottom: 15,
    fontSize: 15,
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
});