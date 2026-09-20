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
  visible = false,
  onClose = () => {},
  isEditing = false,
  title = '',
  setTitle = () => {},
  photoUri = null,
  setPhotoUri = () => {},
  coords = null,
  loadingLocation = false,
  onTakePhoto = () => {},
  onPickGallery = () => {},
  onCaptureLocation = () => {},
  onSubmit = () => {},
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Cabeçalho do Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Editar Registro' : 'Novo Registro'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Campo de Texto */}
            <TextInput
              style={styles.modalInput}
              placeholder="Descreva a anotação, tarefa ou observação..."
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              multiline={true}
            />

            {/* Caixa Informativa do GPS Obrigatório */}
            <View style={[styles.gpsAlertBox, coords ? styles.gpsAlertBoxOk : null]}>
              <Ionicons
                name={coords ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={coords ? '#2e7d32' : '#c62828'}
              />
              <Text style={[styles.gpsAlertText, coords ? styles.gpsAlertTextOk : null]}>
                {coords
                  ? `Local definido: ${coords.address || `${coords.latitude?.toFixed(4)}, ${coords.longitude?.toFixed(4)}`}`
                  : 'A localização via GPS é obrigatória para salvar.'}
              </Text>
            </View>

            {/* Preview da Foto se existir */}
            {photoUri ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => setPhotoUri(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={26} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Botões de Ações (Câmera, Galeria, GPS) */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.mediaButton} onPress={onTakePhoto} activeOpacity={0.7}>
                <Ionicons name="camera-outline" size={18} color="#2f6fed" />
                <Text style={styles.mediaButtonText}>Câmera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.mediaButton} onPress={onPickGallery} activeOpacity={0.7}>
                <Ionicons name="images-outline" size={18} color="#2f6fed" />
                <Text style={styles.mediaButtonText}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaButton, coords ? styles.mediaButtonActive : null]}
                onPress={onCaptureLocation}
                disabled={loadingLocation}
                activeOpacity={0.7}
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
                        coords ? styles.mediaButtonTextActive : null,
                      ]}
                    >
                      {coords ? 'Atualizar GPS' : 'Marcar GPS *'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Botão de Envio / Submissão */}
            <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit} activeOpacity={0.8}>
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