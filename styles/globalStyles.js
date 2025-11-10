import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: 256,
    height: 256,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.borderBlue,
  },
  successCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.successBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderGreen,
  },
  uploadedImage: {
    width: '100%',
    height: 192,
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: colors.textQuaternary,
    textAlign: 'center',
  },
  imageCard: {
    backgroundColor: colors.emptyBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  listImage: {
    width: '100%',
    height: 192,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageName: {
    color: colors.textDark,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  imageInfo: {
    color: colors.textTertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

