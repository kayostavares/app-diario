import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { takePhoto, pickImageFromGallery } from '../services/cameraService';
import { useTheme } from '../styles/theme';
import styles from '../styles/styles';

const PROFILE_KEY = '@diario_app:user_profile';
const PASSWORD_KEY = '@diario_app:user_password';

const ProfileScreen = ({ onBack }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hasRole, setHasRole] = useState(false);
  const [role, setRole] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setName(data.name || '');
          setEmail(data.email || '');
          setAvatarUri(data.avatarUri || null);
          if (data.role) {
            setRole(data.role);
            setHasRole(true);
          }
        } else {
          setName('Pesquisador de Campo');
          setEmail('usuario@campo.com');
        }
      } catch (e) {
        console.log('Erro ao carregar perfil', e);
      }
    })();
  }, []);

  const handleTakePhoto = async () => {
    try {
      const uri = await takePhoto();
      if (uri) setAvatarUri(uri);
    } catch {
      Alert.alert('Erro', 'Permissão de câmera negada.');
    }
  };

  const handlePickGallery = async () => {
    try {
      const uri = await pickImageFromGallery();
      if (uri) setAvatarUri(uri);
    } catch {
      Alert.alert('Erro', 'Permissão de galeria negada.');
    }
  };

  const handleSaveProfile = async () => {
    Keyboard.dismiss();
    if (!name.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Nome e e-mail são obrigatórios.');
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      role: hasRole ? role.trim() : '',
      avatarUri,
    };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleChangePassword = async () => {
    Keyboard.dismiss();
    if (!newPassword || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha os dois campos de senha.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Atenção', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    await AsyncStorage.setItem(PASSWORD_KEY, newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordSection(false);
    Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.headerBg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
            <Text style={{ color: theme.primary, fontWeight: 'bold', marginLeft: 4 }}>Voltar</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Meu Perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.profileScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ position: 'relative', marginBottom: 20 }}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.profileAvatar} />
              ) : (
                <View style={[styles.profileAvatar, styles.avatarPlaceholder, { backgroundColor: theme.inputBg }]}>
                  <Ionicons name="person" size={60} color={theme.textSecondary} />
                </View>
              )}
              <View style={styles.avatarButtonsRow}>
                <TouchableOpacity style={styles.avatarMiniBtn} onPress={handleTakePhoto}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatarMiniBtn} onPress={handlePickGallery}>
                  <Ionicons name="images" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width: '100%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: theme.cardBg,
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={theme.primary} />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>Modo Escuro</Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  thumbColor={isDark ? theme.primary : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#93c5fd' }}
                />
              </View>

              <Text style={[styles.label, { color: theme.textSecondary }]}>Nome Completo</Text>
              <TextInput
                style={[
                  styles.modalInputSingle,
                  { backgroundColor: theme.cardBg, color: theme.text, borderColor: theme.border },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                placeholderTextColor={theme.textSecondary}
              />

              <Text style={[styles.label, { color: theme.textSecondary }]}>E-mail</Text>
              <TextInput
                style={[
                  styles.modalInputSingle,
                  { backgroundColor: theme.cardBg, color: theme.text, borderColor: theme.border },
                ]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="seuemail@exemplo.com"
                placeholderTextColor={theme.textSecondary}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 6,
                  marginBottom: 8,
                }}
              >
                <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 0 }]}>
                  Informar Cargo / Ocupação (Opcional)
                </Text>
                <Switch
                  value={hasRole}
                  onValueChange={(val) => {
                    setHasRole(val);
                    if (!val) setRole('');
                  }}
                  thumbColor={hasRole ? theme.primary : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#93c5fd' }}
                />
              </View>

              {hasRole && (
                <TextInput
                  style={[
                    styles.modalInputSingle,
                    { backgroundColor: theme.cardBg, color: theme.text, borderColor: theme.border },
                  ]}
                  value={role}
                  onChangeText={setRole}
                  placeholder="Ex: Engenheiro Agrônomo, Pesquisador"
                  placeholderTextColor={theme.textSecondary}
                  autoFocus
                />
              )}

              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 10 }]} onPress={handleSaveProfile}>
                <Text style={styles.primaryBtnText}>Salvar Informações</Text>
              </TouchableOpacity>

              <View
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.border,
                  marginTop: 20,
                  padding: 14,
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                  onPress={() => setShowPasswordSection(!showPasswordSection)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.primary} />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>Alterar Senha</Text>
                  </View>
                  <Ionicons
                    name={showPasswordSection ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>

                {showPasswordSection && (
                  <View style={{ marginTop: 14 }}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Nova Senha</Text>
                    <TextInput
                      style={[
                        styles.modalInputSingle,
                        { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
                      ]}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={theme.textSecondary}
                      secureTextEntry
                    />

                    <Text style={[styles.label, { color: theme.textSecondary }]}>Confirmar Nova Senha</Text>
                    <TextInput
                      style={[
                        styles.modalInputSingle,
                        { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
                      ]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Repita a nova senha"
                      placeholderTextColor={theme.textSecondary}
                      secureTextEntry
                    />

                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: '#38a169', marginTop: 6 }]}
                      onPress={handleChangePassword}
                    >
                      <Text style={styles.primaryBtnText}>Confirmar Troca de Senha</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;