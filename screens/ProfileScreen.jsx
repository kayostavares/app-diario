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

const ProfileScreen = ({ onBack }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setName(data.name || '');
          setEmail(data.email || '');
          setRole(data.role || '');
          setAvatarUri(data.avatarUri || null);
        } else {
          setName('Pesquisador de Campo');
          setEmail('usuario@campo.com');
          setRole('Técnico / Pesquisador');
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

    const payload = { name: name.trim(), email: email.trim(), role: role.trim(), avatarUri };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
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
            <View style={{ position: 'relative', marginBottom: 24 }}>
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
                  marginBottom: 16,
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

              <Text style={[styles.label, { color: theme.textSecondary }]}>Cargo / Função</Text>
              <TextInput
                style={[
                  styles.modalInputSingle,
                  { backgroundColor: theme.cardBg, color: theme.text, borderColor: theme.border },
                ]}
                value={role}
                onChangeText={setRole}
                placeholder="Ex: Técnico de Campo"
                placeholderTextColor={theme.textSecondary}
              />

              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 14 }]} onPress={handleSaveProfile}>
                <Text style={styles.primaryBtnText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;