import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import EntryForm from '../components/EntryForm';
import EntryCard from '../components/EntryCard';

import { takePhoto, pickImageFromGallery } from '../services/cameraService';
import { getCurrentLocation } from '../services/locationService';
import { loadEntries, saveEntries } from '../services/storageService';
import { createEntry, updateEntry, toggleEntry, removeEntry } from '../utils/entryUtils';
import styles from '../styles/styles';

const DiarioScreen = ({ onLogout, onOpenProfile }) => {
  const [entries, setEntries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await loadEntries();
        if (Array.isArray(stored)) {
          setEntries(stored);
        }
      } catch (err) {
        console.log('Erro ao carregar dados:', err);
      }
    })();
  }, []);

  const resetForm = () => {
    setTitle('');
    setPhotoUri(null);
    setCoords(null);
    setEditingId(null);
    setModalVisible(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleOpenEdit = (item) => {
    if (!item) return;
    setEditingId(item.id);
    setTitle(item.title || '');
    setPhotoUri(item.photoUri || null);
    setCoords(item.coords || null);
    setModalVisible(true);
  };

  const handleTakePhoto = async () => {
    try {
      const uri = await takePhoto();
      if (uri) setPhotoUri(uri);
    } catch {
      Alert.alert('Erro', 'Permissão de câmera negada ou erro ao capturar.');
    }
  };

  const handlePickGallery = async () => {
    try {
      const uri = await pickImageFromGallery();
      if (uri) setPhotoUri(uri);
    } catch {
      Alert.alert('Erro', 'Permissão de galeria negada.');
    }
  };

  const handleCaptureLocation = async () => {
    setLoadingLocation(true);
    try {
      const loc = await getCurrentLocation();
      if (loc) {
        setCoords(loc);
      }
    } catch {
      Alert.alert('GPS Obrigatório', 'Ative sua localização para continuar.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmitEntry = async () => {
    if (!title || !title.trim()) {
      Alert.alert('Atenção', 'Informe um título/descrição para o registro.');
      return;
    }

    if (!coords) {
      Alert.alert('Localização Obrigatória', 'Por favor, marque a localização via GPS antes de salvar.');
      return;
    }

    try {
      let updated;
      if (editingId) {
        updated = updateEntry(entries, editingId, { title, photoUri, coords });
      } else {
        const newEntry = createEntry({ title, photoUri, coords });
        updated = [newEntry, ...(entries || [])];
      }

      setEntries(updated);
      await saveEntries(updated);
      resetForm();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a anotação.');
    }
  };

  const handleToggle = async (id) => {
    const updated = toggleEntry(entries, id);
    setEntries(updated);
    await saveEntries(updated);
  };

  const handleRemove = (id) => {
    Alert.alert('Excluir', 'Deseja apagar este registro permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const updated = removeEntry(entries, id);
          setEntries(updated);
          await saveEntries(updated);
        },
      },
    ]);
  };

  const handleOpenMap = (item) => {
    if (!item?.coords) return;
    const { latitude, longitude } = item.coords;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const filteredEntries = useMemo(() => {
    if (!Array.isArray(entries)) return [];
    return entries.filter((e) => {
      const matchesSearch = (e.title || '').toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'PENDING') return !e.done;
      if (filter === 'DONE') return e.done;
      return true;
    });
  }, [entries, search, filter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Diário de Campo</Text>
          <Text style={styles.headerSubtitle}>{entries?.length || 0} registros</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.iconBtnHeader} onPress={onOpenProfile}>
            <Ionicons name="person-circle-outline" size={26} color="#2f6fed" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={22} color="#ff5252" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Pesquisar..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
            Todos ({entries?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'PENDING' && styles.filterChipActive]}
          onPress={() => setFilter('PENDING')}
        >
          <Text style={[styles.filterText, filter === 'PENDING' && styles.filterTextActive]}>
            Pendentes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'DONE' && styles.filterChipActive]}
          onPress={() => setFilter('DONE')}
        >
          <Text style={[styles.filterText, filter === 'DONE' && styles.filterTextActive]}>
            Concluídos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EntryCard
            item={item}
            onToggle={handleToggle}
            onEdit={handleOpenEdit}
            onRemove={handleRemove}
            onOpenMap={handleOpenMap}
            onPreviewPhoto={(uri) => setPreviewImage(uri)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
          </View>
        }
      />

      {/* Botão Flutuante (+) para Adicionar */}
      <TouchableOpacity style={styles.fab} onPress={handleOpenCreate} activeOpacity={0.8}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal do Formulário */}
      <EntryForm
        visible={modalVisible}
        onClose={resetForm}
        isEditing={Boolean(editingId)}
        title={title}
        setTitle={setTitle}
        photoUri={photoUri}
        setPhotoUri={setPhotoUri}
        coords={coords}
        loadingLocation={loadingLocation}
        onTakePhoto={handleTakePhoto}
        onPickGallery={handlePickGallery}
        onCaptureLocation={handleCaptureLocation}
        onSubmit={handleSubmitEntry}
      />

      {/* Modal Zoom da Imagem */}
      <Modal visible={Boolean(previewImage)} transparent animationType="fade">
        <View style={styles.zoomModalOverlay}>
          <TouchableOpacity style={styles.closeZoomBtn} onPress={() => setPreviewImage(null)}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {previewImage && (
            <Image source={{ uri: previewImage }} style={styles.zoomImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DiarioScreen;