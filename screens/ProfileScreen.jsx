import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { takePhoto, pickImageFromGallery } from '../services/cameraService';
import styles from '../styles/styles';

const PROFILE_KEY = '@diario_app:user_profile';

const ProfileScreen = ({ onBack }) => {
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={24} color="#2f6fed" />
            <Text style={{ color: '#2f6fed', fontWeight: 'bold', marginLeft: 4 }}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
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
                <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={60} color="#a0aec0" />
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
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.modalInputSingle}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
              />

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.modalInputSingle}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="seuemail@exemplo.com"
              />

              <Text style={styles.label}>Cargo / Função</Text>
              <TextInput
                style={styles.modalInputSingle}
                value={role}
                onChangeText={setRole}
                placeholder="Ex: Técnico de Campo"
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