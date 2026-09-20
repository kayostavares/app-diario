import React, { useState } from 'react';
import {
  SafeAreaView,
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
} from 'react-native';

const ForgotPasswordScreen = ({ onSendReset, onBack }) => {
  const [email, setEmail] = useState('');

  const handleSendReset = () => {
    Keyboard.dismiss();
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail.');
      return;
    }
    onSendReset(email.trim());
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
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backText}>← Voltar</Text>
            </TouchableOpacity>

            <View style={styles.headerBox}>
              <Text style={styles.title}>Esqueceu a senha?</Text>
              <Text style={styles.subtitle}>
                Informe seu e-mail para recuperar o acesso
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>E-mail cadastrado</Text>
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSendReset}
              >
                <Text style={styles.primaryButtonText}>Recuperar senha</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 10,
  },
  backText: {
    color: '#2f6fed',
    fontWeight: '700',
    fontSize: 15,
  },
  headerBox: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 6,
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
    marginBottom: 16,
    fontSize: 15,
    color: '#222',
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
});