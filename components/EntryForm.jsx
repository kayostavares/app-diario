import React from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/styles';

const EntryForm = ({
  visible,
  onClose,
  isEditing,
  title,
  setTitle,
  photoUri,
  setPhotoUri,
  coords,
  loadingLocation,
  onTakePhoto,
  onPickGallery,
  onCaptureLocation,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Editar Registro' : 'Novo Registro'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={styles.modalInput}
              placeholder="Descreva a anotação, tarefa ou observação..."
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              multiline
            />

            {/* Aviso de Local Obrigatório */}
            <View style={[styles.gpsAlertBox, coords ? styles.gpsAlertBoxOk : null]}>
              <Ionicons
                name={coords ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={coords ? '#2e7d32' : '#c62828'}
              />
              <Text style={[styles.gpsAlertText, coords ? styles.gpsAlertTextOk : null]}>
                {coords
                  ? `Local definido: ${coords.address || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`}`
                  : 'A localização via GPS é obrigatória para salvar.'}
              </Text>
            </View>

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
                      name="location"
                      size={18}
                      color={coords ? '#fff' : '#2f6fed'}
                    />
                    <Text
                      style={[
                        styles.mediaButtonText,
                        coords && styles.mediaButtonTextActive,
                      ]}
                    >
                      {coords ? 'Atualizar GPS' : 'Marcar GPS *'}
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EntryForm;