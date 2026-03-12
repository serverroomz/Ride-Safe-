import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';

const KYCSubmissionScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [kycData, setKycData] = useState({
    personalInfo: false,
    documentVerification: false,
    vehicleInfo: false,
    bankDetails: false,
    backgroundCheck: false,
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: 'person', description: 'Basic details & ID' },
    { id: 2, title: 'Document Verification', icon: 'verified-user', description: "Driver's License & documents" },
    { id: 3, title: 'Vehicle Information', icon: 'directions-car', description: 'Vehicle details & registration' },
    { id: 4, title: 'Bank Details', icon: 'account-balance', description: 'Payment method' },
    { id: 5, title: 'Background Check', icon: 'security', description: 'Safety verification' },
  ];

  const handleStepCompletion = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (stepId < 5) {
      setCurrentStep(stepId + 1);
    }
  };

  const progressPercentage = (completedSteps.length / 5) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete Your KYC</Text>
        <Text style={styles.headerSubtitle}>Get verified to start earning</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Verification Progress</Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedSteps.length} of 5 steps completed</Text>
      </View>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id}>
            <TouchableOpacity
              style={[
                styles.stepCard,
                currentStep === step.id && styles.stepCardActive,
                completedSteps.includes(step.id) && styles.stepCardCompleted,
              ]}
              onPress={() => completedSteps.includes(step.id) && setCurrentStep(step.id)}
            >
              <View style={styles.stepNumberContainer}>
                {completedSteps.includes(step.id) ? (
                  <Icon name="check-circle" size={28} color={colors.success} />
                ) : (
                  <View style={[
                    styles.stepNumber,
                    currentStep === step.id && styles.stepNumberActive,
                  ]}>
                    <Text style={styles.stepNumberText}>{step.id}</Text>
                  </View>
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              {currentStep === step.id && (
                <Icon name="arrow-forward" size={24} color={colors.primary} />
              )}
              {completedSteps.includes(step.id) && (
                <Icon name="done" size={24} color={colors.success} />
              )}
            </TouchableOpacity>

            {/* Current Step Content */}
            {currentStep === step.id && (
              <View style={styles.stepContent Detailed}>
                {step.id === 1 && (
                  <PersonalInfoForm onComplete={() => handleStepCompletion(step.id)} />
                )}
                {step.id === 2 && (
                  <DocumentVerificationForm onComplete={() => handleStepCompletion(step.id)} />
                )}
                {step.id === 3 && (
                  <VehicleInfoForm onComplete={() => handleStepCompletion(step.id)} />
                )}
                {step.id === 4 && (
                  <BankDetailsForm onComplete={() => handleStepCompletion(step.id)} />
                )}
                {step.id === 5 && (
                  <BackgroundCheckForm onComplete={() => handleStepCompletion(step.id)} />
                )}
              </View>
            )}

            {index < steps.length - 1 && (
              <View style={styles.stepConnector}>
                <View style={[
                  styles.connectorLine,
                  completedSteps.includes(step.id) && styles.connectorLineCompleted,
                ]} />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Incentives */}
      <View style={styles.incentivesCard}>
        <Icon name="card-giftcard" size={32} color={colors.primary} />
        <Text style={styles.incentivesTitle}>Get Verified, Get Rewards!</Text>
        <Text style={styles.incentivesText}>
          Complete KYC within 24 hours and get ₦1,000 bonus credit
        </Text>
      </View>
    </ScrollView>
  );
};

// Sub-components for each form
const PersonalInfoForm = ({ onComplete }) => (
  <View style={styles.formContainer}>
    <Text style={styles.formTitle}>Personal Information</Text>
    {/* Form fields would go here */}
    <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
      <Text style={styles.continueButtonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const DocumentVerificationForm = ({ onComplete }) => (
  <View style={styles.formContainer}>
    <Text style={styles.formTitle}>Document Verification</Text>
    {/* Form fields would go here */}
    <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
      <Text style={styles.continueButtonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const VehicleInfoForm = ({ onComplete }) => (
  <View style={styles.formContainer}>
    <Text style={styles.formTitle}>Vehicle Information</Text>
    {/* Form fields would go here */}
    <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
      <Text style={styles.continueButtonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const BankDetailsForm = ({ onComplete }) => (
  <View style={styles.formContainer}>
    <Text style={styles.formTitle}>Bank Details</Text>
    {/* Form fields would go here */}
    <TouchableOpacity style={styles.continueButton} onComplete={onComplete}>
      <Text style={styles.continueButtonText}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const BackgroundCheckForm = ({ onComplete }) => (
  <View style={styles.formContainer}>
    <Text style={styles.formTitle}>Background Check</Text>
    {/* Form fields would go here */}
    <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
      <Text style={styles.continueButtonText}>Submit & Verify</Text>
    </TouchableOpacity>
  </View>
);

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
  progressSection: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
  },
  stepsContainer: {
    padding: 15,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 0,
  },
  stepCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  stepCardCompleted: {
    backgroundColor: colors.lightGray,
  },
  stepNumberContainer: {
    marginRight: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    backgroundColor: colors.primary,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  stepDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  stepConnector: {
    paddingLeft: 15 + 16 + 12,
    height: 8,
    justifyContent: 'center',
  },
  connectorLine: {
    height: 8,
    backgroundColor: colors.border,
  },
  connectorLineCompleted: {
    backgroundColor: colors.success,
  },
  stepContentDetailed: {
    backgroundColor: 'white',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },
  continueButton: {
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  incentivesCard: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    alignItems: 'center',
  },
  incentivesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 12,
  },
  incentivesText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default KYCSubmissionScreen;
