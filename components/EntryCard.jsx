import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import styles from '../styles/styles';

const EntryCard = ({
  item,
  folderName = 'Geral',
  onToggle,
  onEdit,
  onRemove,
  onOpenMap,
  onPreviewPhoto,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            { borderColor: theme.border },
            item.done && { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}
          onPress={() => onToggle(item.id)}
        >
          {item.done && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.cardTitle,
              { color: item.done ? theme.textSecondary : theme.text },
              item.done && styles.cardTitleDone,
            ]}
          >
            {item.title}
          </Text>
          <View style={[styles.folderBadge, { backgroundColor: theme.chipBg }]}>
            <Ionicons name="folder" size={12} color={theme.primary} />
            <Text style={[styles.folderBadgeText, { color: theme.primary }]}>
              {folderName}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconBtn}>
          <Ionicons name="pencil-outline" size={18} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={18} color={theme.dangerText} />
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
          <Ionicons name="location-sharp" size={16} color={theme.primary} />
          <Text style={[styles.coordsText, { color: theme.primary }]} numberOfLines={1}>
            {item.coords.address || `${item.coords.latitude?.toFixed(4)}, ${item.coords.longitude?.toFixed(4)}`}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.dateText, { color: theme.textSecondary }]}>
        {new Date(item.createdAt).toLocaleDateString('pt-BR')} às{' '}
        {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        {item.updatedAt ? ' (editado)' : ''}
      </Text>
    </View>
  );
};

export default EntryCard;