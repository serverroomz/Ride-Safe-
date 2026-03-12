import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

const EscortBookingScreen = () => {
  const [preferredGender, setPreferredGender] = useState('any');
  const [safetyFeatures, setSafetyFeatures] = useState({
    gpsTracking: true,
    emergencySOS: true,
    tripRecording: true,
    contactSharing: true,
  });
  const [specialRequirements, setSpecialRequirements] = useState('');

  const toggleSafetyFeature = (feature) => {
    setSafetyFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escort Safety Ride</Text>
      </View>

      {/* Safety Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Features Included</Text>
        <View style={styles.featuresContainer}>
          {[
            { key: 'gpsTracking', label: 'GPS Tracking', icon: 'location-on' },
            { key: 'emergencySOS', label: 'Emergency SOS', icon: 'warning' },
            { key: 'tripRecording', label: 'Trip Recording', icon: 'videocam' },
            { key: 'contactSharing', label: 'Share with Contacts', icon: 'share' },
          ].map(feature => (
            <View key={feature.key} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Icon name={feature.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureLabel}>{feature.label}</Text>
                <Switch
                  value={safetyFeatures[feature.key]}
                  onValueChange={() => toggleSafetyFeature(feature.key)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={safetyFeatures[feature.key] ? colors.primary : colors.textLight}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Driver Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Driver Preference</Text>
        <View style={styles.preferencesContainer}>
          {['any', 'female', 'male'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.preferenceButton,
                preferredGender === option && styles.preferenceButtonActive,
              ]}
              onPress={() => setPreferredGender(option)}
            >
              <Text style={[
                styles.preferenceText,
                preferredGender === option && styles.preferenceTextActive,
              ]}>
                {option === 'any' ? 'Any Driver' : option === 'female' ? 'Female Driver' : 'Male Driver'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trusted Contacts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trusted Contacts</Text>
          <TouchableOpacity>
            <Icon name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>Add emergency contacts who will track your ride</Text>
      </View>

      {/* Special Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Requirements</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Any specific needs or preferences..."
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={4}
          value={specialRequirements}
          onChangeText={setSpecialRequirements}
          textAlignVertical="top"
        />
      </View>

      {/* Pricing */}
      <View style={styles.pricingCard}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Base Fare</Text>
          <Text style={styles.priceValue}>₦500</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Safety Features Premium</Text>
          <Text style={styles.priceValue}>₦1,500</Text>
        </View>
        <View style={[styles.priceRow, styles.priceRowTotal]}>
          <Text style={styles.priceLabelTotal}>Total Estimate</Text>
          <Text style={styles.priceValueTotal}>₦2,500</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Safe Ride - ₦2,500</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Icon name="info" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Your ride will be monitored. You can share your real-time location with trusted contacts.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    padding: 15,
    backgroundColor: 'white',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  preferencesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  preferenceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
  },
  preferenceButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  preferenceText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  preferenceTextActive: {
    color: colors.primary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: -10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  pricingCard: {
    margin: 15,
    padding: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceRowTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  priceLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  priceValueTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  bookButton: {
    marginHorizontal: 15,
    paddingVertical: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 12,
    color: colors.primary,
    lineHeight: 18,
  },
});

export default EscortBookingScreen;
