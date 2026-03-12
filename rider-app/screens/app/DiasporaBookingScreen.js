import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

const DiasporaBookingScreen = () => {
  const [activeTab, setActiveTab] = useState('diaspora');
  const [luggageSize, setLuggageSize] = useState('medium');
  const [isLongDistance, setIsLongDistance] = useState(false);
  const [destinationCity, setDestinationCity] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(0);

  const luggageSizes = [
    { id: 'small', label: 'Small Bag', price: 0 },
    { id: 'medium', label: 'Medium Bag', price: 200 },
    { id: 'large', label: 'Large Luggage', price: 500 },
  ];

  const handleCalculateFare = () => {
    const baseLuggagePrice = luggageSizes.find(l => l.id === luggageSize)?.price || 0;
    const distanceSurcharge = isLongDistance ? 2000 : 0;
    const baseFare = 500;
    setEstimatedFare(baseFare + baseLuggagePrice + distanceSurcharge);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Options</Text>
        <Text style={styles.headerSubtitle}>Choose your ride category</Text>
      </View>

      {/* Ride Type Tabs */}
      <View style={styles.tabContainer}>
        {['diaspora', 'escort', 'standard'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Icon
              name={
                tab === 'diaspora'
                  ? 'backpack'
                  : tab === 'escort'
                  ? 'security'
                  : 'directions-car'
              }
              size={20}
              color={activeTab === tab ? colors.primary : colors.textLight}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Diaspora Ride Details */}
      {activeTab === 'diaspora' && (
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Luggage Details</Text>
            <View style={styles.luggageOptions}>
              {luggageSizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.luggageOption,
                    luggageSize === size.id && styles.selectedLuggageOption,
                  ]}
                  onPress={() => setLuggageSize(size.id)}
                >
                  <Icon
                    name="luggage"
                    size={28}
                    color={
                      luggageSize === size.id
                        ? colors.primary
                        : colors.textLight
                    }
                  />
                  <Text style={styles.luggageLabel}>{size.label}</Text>
                  {size.price > 0 && (
                    <Text style={styles.luggagePrice}>+₦{size.price}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Distance Type</Text>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsLongDistance(!isLongDistance)}
            >
              <View
                style={[
                  styles.checkbox,
                  isLongDistance && styles.checkboxChecked,
                ]}
              >
                {isLongDistance && (
                  <Icon
                    name="check"
                    size={16}
                    color="white"
                  />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Long Distance (Inter-city)</Text>
              <Text style={styles.checkboxPrice}>+₦2,000</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Destination City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter destination city"
              value={destinationCity}
              onChangeText={setDestinationCity}
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Special Requirements</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Fragile items, temperature control, etc."
              multiline
              numberOfLines={4}
              value={specialRequirements}
              onChangeText={setSpecialRequirements}
              placeholderTextColor={colors.textLight}
              textAlignVertical="top"
            />
          </View>

          {/* Estimated Fare */}
          <View style={styles.fareCard}>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base Fare</Text>
              <Text style={styles.fareValue}>₦500</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Luggage Charge</Text>
              <Text style={styles.fareValue}>
                ₦{luggageSizes.find(l => l.id === luggageSize)?.price || 0}
              </Text>
            </View>
            {isLongDistance && (
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Distance Surcharge</Text>
                <Text style={styles.fareValue}>₦2,000</Text>
              </View>
            )}
            <View style={[styles.fareRow, styles.fareTotal]}>
              <Text style={styles.fareLabelTotal}>Estimated Total</Text>
              <Text style={styles.fareTotalValue}>
                ₦{
                  500 +
                  (luggageSizes.find(l => l.id === luggageSize)?.price || 0) +
                  (isLongDistance ? 2000 : 0)
                }
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleCalculateFare}
          >
            <Text style={styles.bookButtonText}>Continue to Booking</Text>
            <Icon name="arrow-forward" size={22} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Escort Ride Details */}
      {activeTab === 'escort' && (
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Safety Features</Text>
            <View style={styles.featuresList}>
              {[
                { id: 'gps', label: 'GPS Tracking', icon: 'location-on' },
                { id: 'sos', label: 'Emergency SOS Button', icon: 'warning' },
                { id: 'recording', label: 'Trip Recording', icon: 'videocam' },
                { id: 'contact', label: 'Emergency Contact Sharing', icon: 'share' },
              ].map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={styles.featureItem}
                >
                  <Icon name={feature.icon} size={24} color={colors.primary} />
                  <Text style={styles.featureName}>{feature.label}</Text>
                  <Icon name="check-circle" size={24} color={colors.success} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Companion Preferences</Text>
            <TouchableOpacity style={styles.checkboxRow}>
              <View style={[styles.checkbox, styles.checkboxChecked]}>
                <Icon name="check" size={16} color="white" />
              </View>
              <Text style={styles.checkboxLabel}>Female Driver Required</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text style={styles.checkboxLabel}>Experienced Driver (3+ years)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Special Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special requirements for your safety..."
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.textLight}
            />
          </View>

          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Escort Ride - ₦2,500</Text>
            <Icon name="arrow-forward" size={22} color="white" />
          </TouchableOpacity>
        </View>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: colors.lightGray,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    fontSize: 12,
    marginTop: 5,
    color: colors.textLight,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  luggageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  luggageOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 4,
  },
  selectedLuggageOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  luggageLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 6,
    fontWeight: '500',
  },
  luggagePrice: {
    fontSize: 11,
    color: colors.success,
    marginTop: 3,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  checkboxPrice: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.lightGray,
  },
  textArea: {
    paddingVertical: 12,
    minHeight: 100,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  featureName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  fareCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: colors.text,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  fareTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 12,
  },
  fareLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  fareTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default DiasporaBookingScreen;
