import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import EntryForm from '../components/EntryForm';
import EntryCard from '../components/EntryCard';

import { takePhoto, pickImageFromGallery } from '../services/cameraService';
import { getCurrentLocation } from '../services/locationService';
import { loadEntries, saveEntries } from '../services/storageService';
import { createEntry, toggleEntry, removeEntry } from '../utils/entryUtils';
import styles from '../styles/styles';

const DiarioScreen = ({ onLogout }) => {
  const [entries, setEntries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Estados de Busca e Filtro
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL | PENDING | DONE

  // Estado para zoom de foto
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    (async () => {
      const stored = await loadEntries();
      setEntries(stored);
    })();
  }, []);

  const handleTakePhoto = async () => {
    try {
      const uri = await takePhoto();
      if (uri) setPhotoUri(uri);
    } catch {
      Alert.alert('Permissão', 'Acesso à câmera foi recusado.');
    }
  };

  const handlePickGallery = async () => {
    try {
      const uri = await pickImageFromGallery();
      if (uri) setPhotoUri(uri);
    } catch {
      Alert.alert('Permissão', 'Acesso às fotos foi recusado.');
    }
  };

  const handleCaptureLocation = async () => {
    setLoadingLocation(true);
    try {
      const loc = await getCurrentLocation();
      setCoords(loc);
    } catch {
      Alert.alert('GPS', 'Não foi possível capturar sua localização.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleAddEntry = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Digite o título da anotação/tarefa.');
      return;
    }

    const newEntry = createEntry({ title, photoUri, coords });
    const updated = [newEntry, ...entries];

    setEntries(updated);
    await saveEntries(updated);

    // Resetar
    setTitle('');
    setPhotoUri(null);
    setCoords(null);
    setModalVisible(false);
  };

  const handleToggle = async (id) => {
    const updated = toggleEntry(entries, id);
    setEntries(updated);
    await saveEntries(updated);
  };

  const handleRemove = (id) => {
    Alert.alert('Excluir', 'Tem certeza que deseja apagar este registro?', [
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
    if (!item.coords) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${item.coords.latitude},${item.coords.longitude}`;
    Linking.openURL(url);
  };

  // Filtragem dinâmica
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (filter === 'PENDING') return !e.done;
      if (filter === 'DONE') return e.done;
      return true;
    });
  }, [entries, search, filter]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Diário de Campo</Text>
          <Text style={styles.headerSubtitle}>{entries.length} anotações cadastradas</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff5252" />
        </TouchableOpacity>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Pesquisar anotações..."
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

      {/* Filtros Rápidos */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
            Todos ({entries.length})
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

      {/* Lista de Registros */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard
            item={item}
            onToggle={handleToggle}
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

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal do Formulário */}
      <EntryForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={title}
        setTitle={setTitle}
        photoUri={photoUri}
        setPhotoUri={setPhotoUri}
        coords={coords}
        loadingLocation={loadingLocation}
        onTakePhoto={handleTakePhoto}
        onPickGallery={handlePickGallery}
        onCaptureLocation={handleCaptureLocation}
        onAddEntry={handleAddEntry}
      />

      {/* Modal de Zoom da Foto */}
      <Modal visible={!!previewImage} transparent animationType="fade">
        <View style={styles.zoomModalOverlay}>
          <TouchableOpacity
            style={styles.closeZoomBtn}
            onPress={() => setPreviewImage(null)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={styles.zoomImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DiarioScreen;