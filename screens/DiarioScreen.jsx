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
import FolderSelectorModal from '../components/FolderSelectorModal';

import { takePhoto, pickImageFromGallery } from '../services/cameraService';
import { getCurrentLocation } from '../services/locationService';
import { loadEntries, saveEntries, loadFolders, saveFolders } from '../services/storageService';
import { createEntry, updateEntry, toggleEntry, removeEntry } from '../utils/entryUtils';
import { useTheme } from '../styles/theme';
import styles from '../styles/styles';

const DiarioScreen = ({ onLogout, onOpenProfile }) => {
  const { theme } = useTheme();

  const [entries, setEntries] = useState([]);
  const [folders, setFolders] = useState([{ id: 'general', name: 'Geral' }]);
  const [selectedFolderFilter, setSelectedFolderFilter] = useState('ALL');

  const [modalVisible, setModalVisible] = useState(false);
  const [folderSelectorVisible, setFolderSelectorVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coords, setCoords] = useState(null);
  const [entryFolderId, setEntryFolderId] = useState('general');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const storedEntries = await loadEntries();
        if (Array.isArray(storedEntries)) setEntries(storedEntries);

        const storedFolders = await loadFolders();
        if (Array.isArray(storedFolders) && storedFolders.length > 0) {
          setFolders(storedFolders);
        }
      } catch (err) {
        console.log('Erro ao carregar dados:', err);
      }
    })();
  }, []);

  const handleCreateFolder = async (name) => {
    const newFolder = { id: Date.now().toString(), name };
    const updated = [...folders, newFolder];
    setFolders(updated);
    await saveFolders(updated);
    setSelectedFolderFilter(newFolder.id);
  };

  const handleDeleteFolder = (folderId) => {
    if (folderId === 'general') {
      Alert.alert('Aviso', 'A pasta "Geral" é padrão do sistema e não pode ser excluída.');
      return;
    }

    const folderName = folderNamesMap[folderId] || 'esta pasta';
    const count = entries.filter((e) => (e.folderId || 'general') === folderId).length;

    if (count === 0) {
      Alert.alert('Excluir Pasta', `Deseja realmente excluir a pasta "${folderName}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedFolders = folders.filter((f) => f.id !== folderId);
            setFolders(updatedFolders);
            await saveFolders(updatedFolders);
            setSelectedFolderFilter('ALL');
            Alert.alert('Pasta Excluída', `A pasta "${folderName}" foi removida.`);
          },
        },
      ]);
      return;
    }

    Alert.alert(
      `Excluir "${folderName}"?`,
      `Esta pasta contém ${count} registro(s). O que deseja fazer com as anotações que estão dentro dela?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Manter registros',
          onPress: async () => {
            const updatedFolders = folders.filter((f) => f.id !== folderId);
            setFolders(updatedFolders);
            await saveFolders(updatedFolders);

            const updatedEntries = entries.map((e) =>
              e.folderId === folderId ? { ...e, folderId: 'general' } : e
            );
            setEntries(updatedEntries);
            await saveEntries(updatedEntries);

            setSelectedFolderFilter('ALL');
            Alert.alert('Concluído', `Pasta removida. As anotações foram movidas para a pasta Geral.`);
          },
        },
        {
          text: 'Excluir tudo',
          style: 'destructive',
          onPress: async () => {
            const updatedFolders = folders.filter((f) => f.id !== folderId);
            setFolders(updatedFolders);
            await saveFolders(updatedFolders);

            const updatedEntries = entries.filter((e) => (e.folderId || 'general') !== folderId);
            setEntries(updatedEntries);
            await saveEntries(updatedEntries);

            setSelectedFolderFilter('ALL');
            Alert.alert('Concluído', `Pasta e ${count} registro(s) foram apagados.`);
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setTitle('');
    setPhotoUri(null);
    setCoords(null);
    setEditingId(null);
    setEntryFolderId(selectedFolderFilter !== 'ALL' ? selectedFolderFilter : 'general');
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
    setEntryFolderId(item.folderId || 'general');
    setModalVisible(true);
  };

  const handleTakePhoto = async () => {
    try {
      const uri = await takePhoto();
      if (uri) setPhotoUri(uri);
    } catch {
      Alert.alert('Erro', 'Permissão de câmera negada.');
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
      if (loc) setCoords(loc);
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
      Alert.alert('Localização Obrigatória', 'Marque o GPS antes de salvar.');
      return;
    }

    try {
      let updated;
      if (editingId) {
        updated = updateEntry(entries, editingId, {
          title,
          photoUri,
          coords,
          folderId: entryFolderId,
        });
      } else {
        const newEntry = createEntry({
          title,
          photoUri,
          coords,
          folderId: entryFolderId,
        });
        updated = [newEntry, ...(entries || [])];
      }

      setEntries(updated);
      await saveEntries(updated);
      resetForm();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar.');
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
          Alert.alert('Sucesso', 'Registro excluído.');
        },
      },
    ]);
  };

  const handleOpenMap = (item) => {
    if (!item?.coords) return;
    const { latitude, longitude } = item.coords;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
  };

  const folderNamesMap = useMemo(() => {
    const map = {};
    folders.forEach((f) => {
      map[f.id] = f.name;
    });
    return map;
  }, [folders]);

  const activeFilterName =
    selectedFolderFilter === 'ALL'
      ? 'Todas as Pastas'
      : folderNamesMap[selectedFolderFilter] || 'Pasta';

  const filteredEntries = useMemo(() => {
    if (!Array.isArray(entries)) return [];
    return entries.filter((e) => {
      if (selectedFolderFilter !== 'ALL' && (e.folderId || 'general') !== selectedFolderFilter) {
        return false;
      }
      const matchesSearch = (e.title || '').toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'PENDING') return !e.done;
      if (filter === 'DONE') return e.done;
      return true;
    });
  }, [entries, search, filter, selectedFolderFilter]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.headerBg} translucent={false} />

      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={styles.headerFolderDropdown}
          onPress={() => setFolderSelectorVisible(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="folder-open" size={20} color={theme.primary} />
            <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
              {activeFilterName}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
          </View>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {filteredEntries.length} de {entries.length} registros
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[styles.iconBtnHeader, { backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }]}
            onPress={onOpenProfile}
          >
            <Ionicons name="person-circle-outline" size={22} color={theme.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: theme.dangerBg }]}
            onPress={onLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.dangerText} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Pesquisar..."
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: theme.text }]}
          placeholderTextColor={theme.textSecondary}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, { backgroundColor: filter === 'ALL' ? theme.primary : theme.chipBg }]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.filterText, { color: filter === 'ALL' ? '#fff' : theme.chipText }]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, { backgroundColor: filter === 'PENDING' ? theme.primary : theme.chipBg }]}
          onPress={() => setFilter('PENDING')}
        >
          <Text style={[styles.filterText, { color: filter === 'PENDING' ? '#fff' : theme.chipText }]}>
            Pendentes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, { backgroundColor: filter === 'DONE' ? theme.primary : theme.chipBg }]}
          onPress={() => setFilter('DONE')}
        >
          <Text style={[styles.filterText, { color: filter === 'DONE' ? '#fff' : theme.chipText }]}>
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
            folderName={folderNamesMap[item.folderId || 'general'] || 'Geral'}
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
            <Ionicons name="folder-open-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhum registro nesta pasta.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleOpenCreate} activeOpacity={0.8}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <FolderSelectorModal
        visible={folderSelectorVisible}
        onClose={() => setFolderSelectorVisible(false)}
        folders={folders}
        selectedFolderId={selectedFolderFilter}
        onSelectFolder={(id) => setSelectedFolderFilter(id)}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        allowAllOption={true}
      />

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
        folders={folders}
        selectedFolderId={entryFolderId}
        setSelectedFolderId={setEntryFolderId}
        onCreateFolder={handleCreateFolder}
        onTakePhoto={handleTakePhoto}
        onPickGallery={handlePickGallery}
        onCaptureLocation={handleCaptureLocation}
        onSubmit={handleSubmitEntry}
      />

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