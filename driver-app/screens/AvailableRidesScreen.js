import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

const AvailableRidesScreen = () => {
  const [rides, setRides] = useState([
    {
      id: 'RIDE001',
      pickupLocation: 'Lekki Phase 1',
      dropLocation: 'Victoria Island',
      passenger: 'Chioma David',
      distance: 8,
      estimatedFare: 2500,
      surgeMultiplier: 1.2,
      rideType: 'standard',
      timestamp: '2 mins ago',
      passengersRating: 4.8,
      pickupCoords: { latitude: 6.4669, longitude: 3.5700 },
      dropCoords: { latitude: 6.4371, longitude: 3.5214 },
    },
    {
      id: 'RIDE002',
      pickupLocation: 'Ikoyi',
      dropLocation: 'Shomolu',
      passenger: 'Yuki Tanaka',
      distance: 12,
      estimatedFare: 3800,
      surgeMultiplier: 1.5,
      rideType: 'premium',
      timestamp: '1 min ago',
      passengersRating: 4.9,
      pickupCoords: { latitude: 6.4662, longitude: 3.5784 },
      dropCoords: { latitude: 6.5547, longitude: 3.3634 },
    },
  ]);

  const [biddingModalVisible, setBiddingModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidAnimations] = useState({
    slide: new Animated.Value(0),
  });

  const openBiddingModal = (ride) => {
    setSelectedRide(ride);
    setBiddingModalVisible(true);
    Animated.spring(bidAnimations.slide, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const submitBid = () => {
    // Submit bid logic
    setBiddingModalVisible(false);
    setBidAmount('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Rides</Text>
        <View style={styles.headerStats}>
          <View style={styles.stat}>
            <Icon name="accessibility" size={16} color={colors.primary} />
            <Text style={styles.statText}>{rides.length} rides</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="trending-up" size={16} color={colors.success} />
            <Text style={styles.statText}>+20% surge</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {rides.map(ride => (
          <View key={ride.id} style={styles.rideCard}>
            {/* Ride Header */}
            <View style={styles.rideHeader}>
              <View style={styles.rideTypeContainer}>
                <Text style={styles.rideTypeText}>{ride.rideType.toUpperCase()}</Text>
                {ride.surgeMultiplier > 1 && (
                  <View style={styles.surgeBadge}>
                    <Text style={styles.surgeBadgeText}>x{ride.surgeMultiplier.toFixed(1)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.rideTime}>{ride.timestamp}</Text>
            </View>

            {/* Location Info */}
            <View style={styles.locationContainer}>
              <View style={styles.location}>
                <Icon name="location-on" size={20} color={colors.primary} />
                <Text style={styles.locationText}>{ride.pickupLocation}</Text>
              </View>
              <View style={styles.locationDivider} />
              <View style={styles.location}>
                <Icon name="location-on" size={20} color={colors.success} />
                <Text style={styles.locationText}>{ride.dropLocation}</Text>
              </View>
            </View>

            {/* Ride Details */}
            <View style={styles.rideDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Icon name="directions" size={16} color={colors.textLight} />
                  <Text style={styles.detailText}>{ride.distance} km</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="person" size={16} color={colors.textLight} />
                  <Text style={styles.detailText}>{ride.passenger}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="star" size={16} color={colors.warning} />
                  <Text style={styles.detailText}>{ride.passengersRating}</Text>
                </View>
              </View>
            </View>

            {/* Base Fare Display */}
            <View style={styles.fareContainer}>
              <View>
                <Text style={styles.fareLabel}>Base Fare</Text>
                <Text style={styles.fareAmount}>₦{ride.estimatedFare.toLocaleString()}</Text>
              </View>
              {ride.surgeMultiplier > 1 && (
                <View style={styles.surgeFareInfo}>
                  <Text style={styles.surgeFareLabel}>Surge Applied</Text>
                  <Text style={styles.surgeFareValue}>
                    ₦{Math.round(ride.estimatedFare * (ride.surgeMultiplier - 1)).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.viewMapButton}>
                <Icon name="map" size={18} color={colors.primary} />
                <Text style={styles.viewMapText}>View Route</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bidButton}
                onPress={() => openBiddingModal(ride)}
              >
                <Icon name="gavel" size={18} color="white" />
                <Text style={styles.bidButtonText}>Place Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bidding Modal */}
      <Modal visible={biddingModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.biddingModal,
              {
                transform: [
                  {
                    translateY: bidAnimations.slide.interpolate({
                      inputRange: [0, 1],
                      outputRange: [500, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.biddingModalHandle} />
            <Text style={styles.biddingModalTitle}>Place Your Bid</Text>

            {selectedRide && (
              <>
                <View style={styles.biddingRideInfo}>
                  <View style={styles.biddingRouteInfo}>
                    <View style={styles.biddingLocationPoint}>
                      <Icon name="location-on" size={16} color={colors.primary} />
                      <Text style={styles.biddingLocationText}>{selectedRide.pickupLocation}</Text>
                    </View>
                    <View style={styles.biddingLocationPoint}>
                      <Icon name="location-on" size={16} color={colors.success} />
                      <Text style={styles.biddingLocationText}>{selectedRide.dropLocation}</Text>
                    </View>
                  </View>
                  <Text style={styles.biddingBaseFare}>
                    Base: ₦{selectedRide.estimatedFare.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.biddingInputContainer}>
                  <Text style={styles.biddingLabel}>Your Bid Amount</Text>
                  <View style={styles.biddingInputBox}>
                    <Text style={styles.bidCurrency}>₦</Text>
                    <TextInput
                      style={styles.bidInputField}
                      placeholder="Enter your bid"
                      keyboardType="numeric"
                      value={bidAmount}
                      onChangeText={setBidAmount}
                      placeholderTextColor={colors.textLight}
                    />
                  </View>
                  <Text style={styles.bidMinimumHint}>
                    Minimum bid: ₦{selectedRide.estimatedFare.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.biddingTips}>
                  <Icon name="info" size={16} color={colors.primary} />
                  <Text style={styles.biddingTipsText}>
                    Higher bids increase chance of acceptance. Bid strategically!
                  </Text>
                </View>

                <View style={styles.biddingButtons}>
                  <TouchableOpacity
                    style={styles.cancelBidButton}
                    onPress={() => setBiddingModalVisible(false)}
                  >
                    <Text style={styles.cancelBidText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitBidButton} onPress={submitBid}>
                    <Text style={styles.submitBidText}>Submit Bid</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

// Add TextInput import at the top
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 15,
  },
  rideCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rideTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rideTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  surgeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.warning,
    borderRadius: 4,
  },
  surgeBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  rideTime: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  locationContainer: {
    marginBottom: 12,
    paddingLeft: 20,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  locationDivider: {
    width: 2,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 8,
    marginVertical: 2,
  },
  rideDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
  fareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 12,
  },
  fareLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  surgeFareInfo: {
    alignItems: 'flex-end',
  },
  surgeFareLabel: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '500',
  },
  surgeFareValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warning,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewMapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    gap: 6,
  },
  viewMapText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  bidButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    gap: 6,
  },
  bidButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  biddingModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 15,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  biddingModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginVertical: 12,
    alignSelf: 'center',
  },
  biddingModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  biddingRideInfo: {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  biddingRouteInfo: {
    marginBottom: 12,
  },
  biddingLocationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  biddingLocationText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  biddingBaseFare: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
  },
  biddingInputContainer: {
    marginBottom: 16,
  },
  biddingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  biddingInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    backgroundColor: colors.lightGray,
  },
  bidCurrency: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  bidInputField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  bidMinimumHint: {
    fontSize: 11,
    color: colors.textLight,
  },
  biddingTips: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  biddingTipsText: {
    flex: 1,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  biddingButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBidButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBidText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  submitBidButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBidText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default AvailableRidesScreen;
