import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/styles';

const EntryCard = ({
  item,
  onToggle,
  onEdit,
  onRemove,
  onOpenMap,
  onPreviewPhoto,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={[styles.checkbox, item.done && styles.checkboxDone]}
          onPress={() => onToggle(item.id)}
        >
          {item.done && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>

        <Text style={[styles.cardTitle, item.done && styles.cardTitleDone]}>
          {item.title}
        </Text>

        {/* Botão de Editar */}
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconBtn}>
          <Ionicons name="pencil-outline" size={18} color="#2f6fed" />
        </TouchableOpacity>

        {/* Botão de Excluir */}
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={18} color="#ff5252" />
        </TouchableOpacity>
      </View>

      {item.photoUri && (
        <TouchableOpacity onPress={() => onPreviewPhoto(item.photoUri)} activeOpacity={0.9}>
          <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
          <View style={styles.zoomBadge}>
            <Ionicons name="expand" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
      )}

      {item.coords && (
        <TouchableOpacity style={styles.locationContainer} onPress={() => onOpenMap(item)}>
          <Ionicons name="location-sharp" size={16} color="#2f6fed" />
          <Text style={styles.coordsText} numberOfLines={1}>
            {item.coords.address || `${item.coords.latitude.toFixed(4)}, ${item.coords.longitude.toFixed(4)}`}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleDateString('pt-BR')} às{' '}
        {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        {item.updatedAt ? ' (editado)' : ''}
      </Text>
    </View>
  );
};

export default EntryCard;