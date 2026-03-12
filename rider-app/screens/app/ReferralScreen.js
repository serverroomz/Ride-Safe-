import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

const ReferralScreen = () => {
  const [referralData] = useState({
    referralCode: 'GOCAB8452X',
    totalEarnings: 15500,
    referralsCount: 5,
    completedRides: 45,
    pendingRewards: 2000,
  });

  const [referrals, setReferrals] = useState([
    {
      id: 1,
      name: 'Chioma David',
      status: 'completed',
      earnedDate: '2024-03-10',
      amount: 500,
      rides: 5,
    },
    {
      id: 2,
      name: 'John Okafor',
      status: 'completed',
      earnedDate: '2024-03-08',
      amount: 500,
      rides: 3,
    },
    {
      id: 3,
      name: 'Zainab Mohammed',
      status: 'pending',
      signupDate: '2024-03-15',
      amount: 200,
      ridesNeeded: 2,
      completedRides: 0,
    },
  ]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on GoCab and get ₦200 welcome bonus! Use my referral code: ${referralData.referralCode}. Download now! https://gocab.app/download`,
        title: 'Get GoCab referral bonus',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyCode = () => {
    // Copy to clipboard
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Referral Program</Text>
        <Text style={styles.headerSubtitle}>Earn rewards by inviting friends</Text>
      </View>

      {/* Earnings Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryValue}>₦{referralData.totalEarnings.toLocaleString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Referrals</Text>
          <Text style={styles.summaryValue}>{referralData.referralsCount}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Pending Rewards</Text>
          <Text style={styles.summaryValuePending}>₦{referralData.pendingRewards}</Text>
        </View>
      </View>

      {/* Referral Code */}
      <View style={styles.referralCodeCard}>
        <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
        <View style={styles.referralCodeContainer}>
          <Text style={styles.referralCodeText}>{referralData.referralCode}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
            <Icon name="content-copy" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.referralCodeHint}>Share this code to earn ₦500 per referral</Text>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon name="share" size={20} color="white" />
          <Text style={styles.shareButtonText}>Share with Friends</Text>
        </TouchableOpacity>

        <View style={styles.shareMethodsContainer}>
          <TouchableOpacity style={styles.shareMethod}>
            <Icon name="sms" size={20} color={colors.primary} />
            <Text style={styles.shareMethodText}>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareMethod}>
            <Icon name="email" size={20} color={colors.primary} />
            <Text style={styles.shareMethodText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareMethod}>
            <Icon name="share" size={20} color={colors.primary} />
            <Text style={styles.shareMethodText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Share Your Code</Text>
              <Text style={styles.stepDescription}>Send your referral code to friends</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Friend Signs Up</Text>
              <Text style={styles.stepDescription}>They get ₦200 signup bonus</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Complete Rides</Text>
              <Text style={styles.stepDescription}>After 5 rides, you earn ₦500</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Rewarded</Text>
              <Text style={styles.stepDescription}>Withdraw to your wallet anytime</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Referral History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Referral History</Text>
        {referrals.map(referral => (
          <View key={referral.id} style={styles.referralItem}>
            <View style={styles.referralItemIcon}>
              <Icon name="person" size={24} color={colors.primary} />
            </View>
            <View style={styles.referralItemContent}>
              <Text style={styles.referralItemName}>{referral.name}</Text>
              <View style={styles.referralItemMeta}>
                {referral.status === 'completed' ? (
                  <>
                    <Text style={styles.referralItemDate}>Earned on {referral.earnedDate}</Text>
                    <Text style={styles.referralItemDot}>•</Text>
                    <Text style={styles.referralItemRides}>{referral.rides} rides</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.referralItemStatus}>Pending</Text>
                    <Text style={styles.referralItemDot}>•</Text>
                    <Text style={styles.referralItemRides}>
                      {referral.completedRides}/{referral.ridesNeeded} rides
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.referralItemReward}>
              <Text style={[styles.referralItemAmount, referral.status === 'pending' && styles.pendingAmount]}>
                ₦{referral.amount}
              </Text>
              <Text style={styles.referralItemStatus}>{referral.status}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Terms */}
      <View style={styles.termsCard}>
        <Text style={styles.termsTitle}>Terms &amp; Conditions</Text>
        <Text style={styles.termsText}>
          • You earn ₦500 per successful referral after your friend completes 5 rides
        </Text>
        <Text style={styles.termsText}>
          • Your friend gets ₦200 signup bonus
        </Text>
        <Text style={styles.termsText}>
          • Rewards are credited within 24 hours of completion
        </Text>
        <Text style={styles.termsText}>
          • No limit on number of referrals
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
  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: -20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 6,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryValuePending: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.warning,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  referralCodeCard: {
    marginHorizontal: 15,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  referralCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  referralCodeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  referralCodeHint: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
    fontWeight: '500',
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  shareMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  shareMethod: {
    alignItems: 'center',
  },
  shareMethodText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '500',
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
  stepContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  stepDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  referralItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  referralItemContent: {
    flex: 1,
  },
  referralItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  referralItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  referralItemDate: {
    fontSize: 11,
    color: colors.textLight,
  },
  referralItemRides: {
    fontSize: 11,
    color: colors.textLight,
  },
  referralItemDot: {
    marginHorizontal: 4,
    color: colors.border,
  },
  referralItemStatus: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '600',
  },
  pendingAmount: {
    color: colors.warning,
  },
  referralItemReward: {
    alignItems: 'flex-end',
  },
  referralItemAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  termsCard: {
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginBottom: 30,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default ReferralScreen;
