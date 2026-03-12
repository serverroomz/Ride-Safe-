import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

const PaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const paymentMethods = [
    { id: 'paystack', name: 'Paystack', icon: 'payment', badge: 'Get 5% cashback' },
    { id: 'stripe', name: 'Stripe Card', icon: 'credit-card', badge: 'Secure' },
    { id: 'wallet', name: 'GoCab Wallet', icon: 'account-balance-wallet' },
    { id: 'bank', name: 'Bank Transfer', icon: 'account-balance', badge: 'Free' },
  ];

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <Text style={styles.headerSubtitle}>Secure and fast</Text>
      </View>

      {/* Amount Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Amount to Add</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor={colors.textLight}
          />
        </View>
        <View style={styles.quickAmounts}>
          {[1000, 5000, 10000, 20000].map(value => (
            <TouchableOpacity
              key={value}
              style={styles.quickAmountButton}
              onPress={() => setAmount(value.toString())}
            >
              <Text style={styles.quickAmountText}>₦{value.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.label}>Payment Method</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethodCard,
              selectedMethod === method.id && styles.paymentMethodCardActive,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.methodIcon}>
              <Icon
                name={method.icon}
                size={24}
                color={selectedMethod === method.id ? colors.primary : colors.textLight}
              />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodName}>{method.name}</Text>
              {method.badge && (
                <Text style={styles.methodBadge}>{method.badge}</Text>
              )}
            </View>
            <View style={[
              styles.radioButton,
              selectedMethod === method.id && styles.radioButtonSelected,
            ]}>
              {selectedMethod === method.id && (
                <Icon name="check" size={14} color="white" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Amount</Text>
          <Text style={styles.summaryValue}>₦{amount || '0'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Convenience Fee</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryRowTotal]}>
          <Text style={styles.summaryLabelTotal}>Total</Text>
          <Text style={styles.summaryValueTotal}>₦{amount || '0'}</Text>
        </View>
      </View>

      {/* Terms */}
      <View style={styles.termsContainer}>
        <Icon name="check-circle" size={18} color={colors.success} />
        <Text style={styles.termsText}>
          Your payment is secured with industry-standard encryption
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.payButton, !amount && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={!amount || isProcessing}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? 'Processing...' : 'Proceed to Pay'}
        </Text>
        {!isProcessing && <Icon name="arrow-forward" size={20} color="white" />}
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Icon name="check-circle" size={60} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successText}>
              ₦{amount} has been added to your wallet
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccess(false);
                setAmount('');
              }}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
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
  section: {
    padding: 15,
    marginTop: 10,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.lightGray,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 10,
  },
  paymentMethodCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    marginRight: 12,
  },
  methodContent: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  methodBadge: {
    fontSize: 11,
    color: colors.success,
    marginTop: 2,
    fontWeight: '500',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  summaryCard: {
    marginHorizontal: 15,
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryRowTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  termsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  termsText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 12,
    color: colors.textLight,
  },
  payButton: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PaymentScreen;
