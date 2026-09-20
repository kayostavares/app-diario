import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/styles';

const FolderSelectorModal = ({
  visible,
  onClose,
  folders = [],
  selectedFolderId = 'ALL',
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  allowAllOption = true,
}) => {
  const [searchFolder, setSearchFolder] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredFolders = useMemo(() => {
    return folders.filter((f) =>
      f.name.toLowerCase().includes(searchFolder.toLowerCase())
    );
  }, [folders, searchFolder]);

  const handleCreate = () => {
    if (!newFolderName.trim()) {
      Alert.alert('Atenção', 'Digite o nome da pasta.');
      return;
    }
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsCreating(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* 1. Toque no fundo escuro fecha o modal */}
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
          {/* 2. Toque dentro do card NÃO fecha o modal */}
          <TouchableWithoutFeedback>
            <View style={styles.sheetContent}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Coleções & Pastas</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {isCreating ? (
                <View style={styles.createFolderRow}>
                  <TextInput
                    style={styles.createFolderInput}
                    placeholder="Nome da pasta..."
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    autoFocus
                  />
                  <TouchableOpacity style={styles.createFolderConfirmBtn} onPress={handleCreate}>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.createFolderCancelBtn}
                    onPress={() => {
                      setIsCreating(false);
                      setNewFolderName('');
                    }}
                  >
                    <Ionicons name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.btnOpenCreateFolder}
                  onPress={() => setIsCreating(true)}
                >
                  <Ionicons name="add-circle" size={20} color="#2f6fed" />
                  <Text style={styles.btnOpenCreateFolderText}>Criar Nova Pasta</Text>
                </TouchableOpacity>
              )}

              {folders.length > 4 && (
                <View style={styles.folderSearchBar}>
                  <Ionicons name="search" size={16} color="#888" />
                  <TextInput
                    style={styles.folderSearchInput}
                    placeholder="Filtrar pastas..."
                    value={searchFolder}
                    onChangeText={setSearchFolder}
                    placeholderTextColor="#999"
                  />
                </View>
              )}

              <FlatList
                data={filteredFolders}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                  allowAllOption ? (
                    <TouchableOpacity
                      style={[
                        styles.folderListItem,
                        selectedFolderId === 'ALL' && styles.folderListItemActive,
                      ]}
                      onPress={() => {
                        onSelectFolder('ALL');
                        onClose();
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons
                          name="albums"
                          size={20}
                          color={selectedFolderId === 'ALL' ? '#2f6fed' : '#666'}
                        />
                        <Text
                          style={[
                            styles.folderListItemText,
                            selectedFolderId === 'ALL' && styles.folderListItemTextActive,
                          ]}
                        >
                          Todas as Pastas
                        </Text>
                      </View>
                      {selectedFolderId === 'ALL' && (
                        <Ionicons name="checkmark-circle" size={20} color="#2f6fed" />
                      )}
                    </TouchableOpacity>
                  ) : null
                }
                renderItem={({ item }) => {
                  const isSelected = selectedFolderId === item.id;
                  return (
                    <View
                      style={[
                        styles.folderListItem,
                        isSelected && styles.folderListItemActive,
                      ]}
                    >
                      <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                        onPress={() => {
                          onSelectFolder(item.id);
                          onClose();
                        }}
                      >
                        <Ionicons
                          name="folder"
                          size={20}
                          color={isSelected ? '#2f6fed' : '#f5a623'}
                        />
                        <Text
                          style={[
                            styles.folderListItemText,
                            isSelected && styles.folderListItemTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>

                      {onDeleteFolder && item.id !== 'general' && (
                        <TouchableOpacity
                          onPress={() => onDeleteFolder(item.id)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ff5252" />
                        </TouchableOpacity>
                      )}

                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#2f6fed"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </View>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default FolderSelectorModal;