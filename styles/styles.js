import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  infoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  // Top Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  // Filter Chips
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#edf2f7',
  },
  filterChipActive: {
    backgroundColor: '#2f6fed',
  },
  filterText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  // Lista
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#a0aec0',
    marginTop: 8,
    fontSize: 14,
  },
  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#2f6fed',
    borderColor: '#2f6fed',
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3748',
  },
  cardTitleDone: {
    textDecorationLine: 'line-through',
    color: '#a0aec0',
  },
  deleteBtnContainer: {
    padding: 4,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginTop: 12,
  },
  zoomBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  coordsText: {
    color: '#2f6fed',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  dateText: {
    color: '#a0aec0',
    fontSize: 11,
    marginTop: 8,
  },
  // Floating Action Button (FAB)
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2f6fed',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#2f6fed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  // Modal de Criação
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 14,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  previewImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  mediaButtonActive: {
    backgroundColor: '#2f6fed',
    borderColor: '#2f6fed',
  },
  mediaButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2f6fed',
  },
  mediaButtonTextActive: {
    color: '#fff',
  },
  gpsInfoText: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: '#2f6fed',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Modal de Foto Cheia
  zoomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeZoomBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  zoomImage: {
    width: width,
    height: '80%',
  },
});

export default styles;