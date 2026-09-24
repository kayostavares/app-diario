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
import { useTheme } from '../styles/theme';
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
  const { theme } = useTheme();
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
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
          <TouchableWithoutFeedback>
            <View style={[styles.sheetContent, { backgroundColor: theme.cardBg }]}>
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetTitle, { color: theme.text }]}>Coleções & Pastas</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {isCreating ? (
                <View style={styles.createFolderRow}>
                  <TextInput
                    style={[
                      styles.createFolderInput,
                      { backgroundColor: theme.inputBg, borderColor: theme.primary, color: theme.text },
                    ]}
                    placeholder="Nome da pasta..."
                    placeholderTextColor={theme.textSecondary}
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    autoFocus
                  />
                  <TouchableOpacity
                    style={[styles.createFolderConfirmBtn, { backgroundColor: theme.primary }]}
                    onPress={handleCreate}
                  >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.createFolderCancelBtn, { backgroundColor: theme.inputBg }]}
                    onPress={() => {
                      setIsCreating(false);
                      setNewFolderName('');
                    }}
                  >
                    <Ionicons name="close" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.btnOpenCreateFolder, { backgroundColor: theme.chipBg }]}
                  onPress={() => setIsCreating(true)}
                >
                  <Ionicons name="add-circle" size={20} color={theme.primary} />
                  <Text style={[styles.btnOpenCreateFolderText, { color: theme.primary }]}>Criar Nova Pasta</Text>
                </TouchableOpacity>
              )}

              {folders.length > 4 && (
                <View style={[styles.folderSearchBar, { backgroundColor: theme.inputBg }]}>
                  <Ionicons name="search" size={16} color={theme.textSecondary} />
                  <TextInput
                    style={[styles.folderSearchInput, { color: theme.text }]}
                    placeholder="Filtrar pastas..."
                    value={searchFolder}
                    onChangeText={setSearchFolder}
                    placeholderTextColor={theme.textSecondary}
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
                        { borderBottomColor: theme.border },
                        selectedFolderId === 'ALL' && { backgroundColor: theme.isDark ? '#233876' : '#ebf3ff' },
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
                          color={selectedFolderId === 'ALL' ? theme.primary : theme.textSecondary}
                        />
                        <Text
                          style={[
                            styles.folderListItemText,
                            { color: theme.text },
                            selectedFolderId === 'ALL' && { color: theme.primary, fontWeight: '700' },
                          ]}
                        >
                          Todas as Pastas
                        </Text>
                      </View>
                      {selectedFolderId === 'ALL' && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
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
                        { borderBottomColor: theme.border },
                        isSelected && { backgroundColor: theme.isDark ? '#233876' : '#ebf3ff' },
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
                          color={isSelected ? theme.primary : '#f5a623'}
                        />
                        <Text
                          style={[
                            styles.folderListItemText,
                            { color: theme.text },
                            isSelected && { color: theme.primary, fontWeight: '700' },
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
                          <Ionicons name="trash-outline" size={18} color={theme.dangerText} />
                        </TouchableOpacity>
                      )}

                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={theme.primary}
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