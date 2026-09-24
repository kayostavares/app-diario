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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../styles/theme';

const ForgotPasswordScreen = ({ onSendReset, onBack }) => {
  const { theme } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
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
              <Text style={[styles.backText, { color: theme.primary }]}>← Voltar</Text>
            </TouchableOpacity>

            <View style={styles.headerBox}>
              <Text style={[styles.title, { color: theme.text }]}>Esqueceu a senha?</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Informe seu e-mail para recuperar o acesso
              </Text>
            </View>

            <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>E-mail cadastrado</Text>
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

              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.primary }]}
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
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
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
    marginBottom: 16,
    fontSize: 15,
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
});