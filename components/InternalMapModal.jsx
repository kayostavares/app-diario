import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';

const InternalMapModal = ({ visible, onClose, coords, title }) => {
  const { theme } = useTheme();

  if (!coords) return null;

  const lat = coords.latitude;
  const lng = coords.longitude;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #e5e3df; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: true }).setView([${lat}, ${lng}], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);
          const marker = L.marker([${lat}, ${lng}]).addTo(map);
          marker.bindPopup("<b>${title || 'Local Marcado'}</b>").openPopup();
        </script>
      </body>
    </html>
  `;

  const handleOpenExternal = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={mapStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[mapStyles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <View style={mapStyles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="map" size={22} color={theme.primary} />
              <Text style={[mapStyles.title, { color: theme.text }]}>Visualização do Local</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[mapStyles.entryTitle, { color: theme.textSecondary }]} numberOfLines={1}>
            Registro: <Text style={{ color: theme.text, fontWeight: '600' }}>{title || 'Sem título'}</Text>
          </Text>

          <View style={mapStyles.mapContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: mapHtml }}
              style={{ flex: 1, borderRadius: 14 }}
              nestedScrollEnabled={true}
              scrollEnabled={true}
            />
          </View>

          <View style={[mapStyles.addressBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Ionicons name="location-sharp" size={18} color="#e53e3e" />
            <Text style={[mapStyles.addressText, { color: theme.text }]} numberOfLines={2}>
              {coords.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <TouchableOpacity
              style={[mapStyles.actionBtn, { backgroundColor: theme.inputBg, borderColor: theme.border, borderWidth: 1 }]}
              onPress={onClose}
            >
              <Text style={{ color: theme.text, fontWeight: '600' }}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[mapStyles.actionBtn, { backgroundColor: theme.primary, flex: 1.5 }]}
              onPress={handleOpenExternal}
            >
              <Ionicons name="navigate-outline" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Abrir no Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default InternalMapModal;

const mapStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 28,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryTitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  mapContainer: {
    width: '100%',
    height: 250,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
});