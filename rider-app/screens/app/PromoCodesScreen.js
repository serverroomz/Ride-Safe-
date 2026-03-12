import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

const PromoCodesScreen = () => {
  const [promoCode, setPromoCode] = useState('');
  const [activePromoCodes, setActivePromoCodes] = useState([
    {
      id: 1,
      code: 'GO50KM',
      description: '30% off on 50km+ rides',
      discount: '30%',
      expiresIn: '5 days',
      used: false,
      applicableRides: ['standard', 'premium'],
    },
    {
      id: 2,
      code: 'DIASP100',
      description: 'Get ₦1,000 off diaspora rides',
      discount: '₦1,000',
      expiresIn: '7 days',
      used: false,
      applicableRides: ['diaspora'],
    },
    {
      id: 3,
      code: 'SAFE20',
      description: '20% off escort safe rides',
      discount: '20%',
      expiresIn: '14 days',
      used: false,
      applicableRides: ['escort'],
    },
  ]);

  const [usedCodes, setUsedCodes] = useState([
    {
      id: 4,
      code: 'WELCOME100',
      description: 'Welcome bonus (used)',
      discount: '₦500',
      usedOn: 'Mar 10, 2024',
      applicableRides: ['all'],
    },
  ]);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);

  const applyCode = () => {
    // Implementation logic
    setShowApplyModal(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Promo Codes</Text>
        <Text style={styles.headerSubtitle}>Save money on every ride</Text>
      </View>

      {/* Apply Code Section */}
      <View style={styles.applySection}>
        <Text style={styles.sectionLabel}>Have a promo code?</Text>
        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Enter promo code"
            placeholderTextColor={colors.textLight}
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyButton}>
            <Icon name="check-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Codes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Offers</Text>
        {activePromoCodes.map(code => (
          <TouchableOpacity
            key={code.id}
            style={styles.codeCard}
            onPress={() => {
              setSelectedCode(code);
              setShowApplyModal(true);
            }}
          >
            <View style={styles.codeCardLeft}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{code.discount}</Text>
              </View>
              <View style={styles.codeInfo}>
                <Text style={styles.codeText}>{code.code}</Text>
                <Text style={styles.codeDescription}>{code.description}</Text>
                <View style={styles.rideTypesContainer}>
                  {code.applicableRides.map(ride => (
                    <View key={ride} style={styles.rideTypeBadge}>
                      <Text style={styles.rideTypeText}>{ride}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.codeCardRight}>
              <Text style={styles.expireText}>Expires in</Text>
              <Text style={styles.expireValue}>{code.expiresIn}</Text>
              <TouchableOpacity style={styles.useButton}>
                <Text style={styles.useButtonText}>Use</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Used Codes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Used Codes</Text>
        {usedCodes.map(code => (
          <View key={code.id} style={[styles.codeCard, styles.usedCodeCard]}>
            <View style={styles.codeCardLeft}>
              <View style={[styles.discountBadge, styles.usedBadge]}>
                <Text style={styles.discountText}>{code.discount}</Text>
              </View>
              <View style={styles.codeInfo}>
                <Text style={[styles.codeText, styles.usedCodeText]}>{code.code}</Text>
                <Text style={styles.codeDescription}>{code.description}</Text>
              </View>
            </View>
            <View style={styles.codeCardRight}>
              <Text style={styles.usedOnText}>Used on</Text>
              <Text style={styles.usedOnValue}>{code.usedOn}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* How It Works */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How Promo Codes Work</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoNumber}>
            <Text style={styles.infoNumberText}>1</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>Enter or apply a valid promo code</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoNumber}>
            <Text style={styles.infoNumberText}>2</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>Book your ride as usual</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoNumber}>
            <Text style={styles.infoNumberText}>3</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>Get instant discount or cashback</Text>
          </View>
        </View>
      </View>

      {/* Apply Code Modal */}
      <Modal visible={showApplyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowApplyModal(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Apply Code</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedCode && (
              <>
                <View style={styles.modalCodeDetails}>
                  <View style={styles.largeDiscountBadge}>
                    <Text style={styles.largeDiscountText}>{selectedCode.discount}</Text>
                  </View>
                  <Text style={styles.modalCodeText}>{selectedCode.code}</Text>
                  <Text style={styles.modalCodeDesc}>{selectedCode.description}</Text>
                </View>

                <View style={styles.modalTerms}>
                  <Text style={styles.modalTermsTitle}>Terms &amp; Conditions</Text>
                  <Text style={styles.modalTermsText}>
                    • Valid for {selectedCode.applicableRides.join(', ')} rides
                  </Text>
                  <Text style={styles.modalTermsText}>
                    • Minimum ride amount may apply
                  </Text>
                  <Text style={styles.modalTermsText}>
                    • Cannot be combined with other offers
                  </Text>
                  <Text style={styles.modalTermsText}>
                    • Expires in {selectedCode.expiresIn}
                  </Text>
                </View>

                <TouchableOpacity style={styles.applyModalButton} onPress={applyCode}>
                  <Text style={styles.applyModalButtonText}>Apply Code</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  applySection: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 10,
    fontWeight: '500',
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.lightGray,
  },
  codeInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  codeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  usedCodeCard: {
    opacity: 0.6,
  },
  codeCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountBadge: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  usedBadge: {
    backgroundColor: colors.lightGray,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  codeInfo: {
    flex: 1,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  usedCodeText: {
    color: colors.textLight,
  },
  codeDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  rideTypesContainer: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 4,
    flex Wrap: 'wrap',
  },
  rideTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
  },
  rideTypeText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },
  codeCardRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  expireText: {
    fontSize: 11,
    color: colors.textLight,
  },
  expireValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginVertical: 4,
  },
  useButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  useButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  usedOnText: {
    fontSize: 11,
    color: colors.textLight,
  },
  usedOnValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginVertical: 4,
  },
  infoCard: {
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoNumberText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  infoContent: {
    flex: 1,
    paddingTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modalCodeDetails: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  largeDiscountBadge: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeDiscountText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  modalCodeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  modalCodeDesc: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  modalTerms: {
    paddingVertical: 16,
    marginVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  modalTermsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  modalTermsText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
  applyModalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PromoCodesScreen;
