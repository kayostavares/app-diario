import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/styles';

const EntryForm = ({
  visible,
  onClose,
  title,
  setTitle,
  photoUri,
  setPhotoUri,
  coords,
  loadingLocation,
  onTakePhoto,
  onPickGallery,
  onCaptureLocation,
  onAddEntry,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Novo Registro</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalInput}
            placeholder="Descreva a anotação, tarefa ou observação..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            multiline
          />

          {/* Miniatura da foto se houver */}
          {photoUri && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={() => setPhotoUri(null)}
              >
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          )}

          {/* Botões de Ações de Mídia e Local */}
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
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={coords ? '#fff' : '#2f6fed'}
                  />
                  <Text
                    style={[
                      styles.mediaButtonText,
                      coords && styles.mediaButtonTextActive,
                    ]}
                  >
                    {coords ? 'Marcado' : 'GPS'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {coords && coords.address && (
            <Text style={styles.gpsInfoText} numberOfLines={1}>
              📍 {coords.address}
            </Text>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.primaryBtn} onPress={onAddEntry}>
            <Text style={styles.primaryBtnText}>Salvar Registro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EntryForm;