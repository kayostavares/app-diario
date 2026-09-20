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
      {/* Toque fora para fechar */}
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
          {/* Evita que toques no formulário fechem a tela */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Editar Registro' : 'Novo Registro'}
                </Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {/* Seletor de Pasta */}
                <Text style={styles.label}>Salvar na Pasta:</Text>
                <TouchableOpacity
                  style={styles.folderDropdownBtn}
                  onPress={() => setFolderPickerVisible(true)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="folder" size={18} color="#2f6fed" />
                    <Text style={styles.folderDropdownBtnText}>{currentFolderName}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#666" />
                </TouchableOpacity>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Descreva a anotação, tarefa ou observação..."
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                  multiline
                />

                <View style={[styles.gpsAlertBox, coords ? styles.gpsAlertBoxOk : null]}>
                  <Ionicons
                    name={coords ? 'checkmark-circle' : 'alert-circle'}
                    size={18}
                    color={coords ? '#2e7d32' : '#c62828'}
                  />
                  <Text style={[styles.gpsAlertText, coords ? styles.gpsAlertTextOk : null]}>
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
                  <TouchableOpacity style={styles.mediaButton} onPress={onTakePhoto}>
                    <Ionicons name="camera-outline" size={18} color="#2f6fed" />
                    <Text style={styles.mediaButtonText}>Câmera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.mediaButton} onPress={onPickGallery}>
                    <Ionicons name="images-outline" size={18} color="#2f6fed" />
                    <Text style={styles.mediaButtonText}>Galeria</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.mediaButton, coords && styles.mediaButtonActive]}
                    onPress={onCaptureLocation}
                    disabled={loadingLocation}
                  >
                    {loadingLocation ? (
                      <ActivityIndicator size="small" color="#2f6fed" />
                    ) : (
                      <>
                        <Ionicons name="location" size={18} color={coords ? '#fff' : '#2f6fed'} />
                        <Text style={[styles.mediaButtonText, coords && styles.mediaButtonTextActive]}>
                          {coords ? 'GPS Ok' : 'Marcar GPS *'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit}>
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