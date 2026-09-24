import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FolderSelectorModal from './FolderSelectorModal';
import { useTheme } from '../styles/theme';
import styles from '../styles/styles';

const EntryForm = ({
  visible = false,
  onClose = () => {},
  isEditing = false,
  title = '',
  setTitle = () => {},
  photoUri = null,
  setPhotoUri = () => {},
  coords = null,
  loadingLocation = false,
  folders = [],
  selectedFolderId = 'general',
  setSelectedFolderId = () => {},
  onCreateFolder = () => {},
  onTakePhoto = () => {},
  onPickGallery = () => {},
  onCaptureLocation = () => {},
  onSubmit = () => {},
}) => {
  const { theme } = useTheme();
  const [folderPickerVisible, setFolderPickerVisible] = useState(false);

  const currentFolderName =
    folders.find((f) => f.id === selectedFolderId)?.name || 'Geral';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {isEditing ? 'Editar Registro' : 'Novo Registro'}
                </Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Salvar na Pasta:</Text>
                <TouchableOpacity
                  style={[styles.folderDropdownBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
                  onPress={() => setFolderPickerVisible(true)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="folder" size={18} color={theme.primary} />
                    <Text style={[styles.folderDropdownBtnText, { color: theme.text }]}>{currentFolderName}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.modalInput,
                    { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
                  ]}
                  placeholder="Descreva a anotação, tarefa ou observação..."
                  placeholderTextColor={theme.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                  multiline
                />

                <View
                  style={[
                    styles.gpsAlertBox,
                    coords
                      ? { backgroundColor: theme.isDark ? '#14381e' : '#e8f5e9' }
                      : { backgroundColor: theme.dangerBg },
                  ]}
                >
                  <Ionicons
                    name={coords ? 'checkmark-circle' : 'alert-circle'}
                    size={18}
                    color={coords ? '#4caf50' : theme.dangerText}
                  />
                  <Text
                    style={[
                      styles.gpsAlertText,
                      coords
                        ? { color: '#4caf50' }
                        : { color: theme.dangerText },
                    ]}
                  >
                    {coords
                      ? `Local: ${coords.address || `${coords.latitude?.toFixed(4)}, ${coords.longitude?.toFixed(4)}`}`
                      : 'A localização via GPS é obrigatória para salvar.'}
                  </Text>
                </View>

                {photoUri && (
                  <View style={styles.previewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
                    <TouchableOpacity
                      style={styles.removePhotoBtn}
                      onPress={() => setPhotoUri(null)}
                    >
                      <Ionicons name="close-circle" size={26} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.mediaButton, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
                    onPress={onTakePhoto}
                  >
                    <Ionicons name="camera-outline" size={18} color={theme.primary} />
                    <Text style={[styles.mediaButtonText, { color: theme.primary }]}>Câmera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.mediaButton, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
                    onPress={onPickGallery}
                  >
                    <Ionicons name="images-outline" size={18} color={theme.primary} />
                    <Text style={[styles.mediaButtonText, { color: theme.primary }]}>Galeria</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mediaButton,
                      { backgroundColor: theme.inputBg, borderColor: theme.border },
                      coords && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                    onPress={onCaptureLocation}
                    disabled={loadingLocation}
                  >
                    {loadingLocation ? (
                      <ActivityIndicator size="small" color={theme.primary} />
                    ) : (
                      <>
                        <Ionicons
                          name="location"
                          size={18}
                          color={coords ? '#fff' : theme.primary}
                        />
                        <Text
                          style={[
                            styles.mediaButtonText,
                            { color: theme.primary },
                            coords && { color: '#fff' },
                          ]}
                        >
                          {coords ? 'GPS Ok' : 'Marcar GPS *'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
                  onPress={onSubmit}
                >
                  <Text style={styles.primaryBtnText}>
                    {isEditing ? 'Salvar Edição' : 'Cadastrar Registro'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>

      <FolderSelectorModal
        visible={folderPickerVisible}
        onClose={() => setFolderPickerVisible(false)}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={(id) => setSelectedFolderId(id)}
        onCreateFolder={onCreateFolder}
        allowAllOption={false}
      />
    </Modal>
  );
};

export default EntryForm;