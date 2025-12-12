// app/(patient)/VerifyCodeScreen.tsx - VERSION AMÉLIORÉE

import { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '@/components/Button'; 
import { verifyPatientCode } from '@/services/api';
import { Colors } from '@/constants/Colors';
import { Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react-native';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { id_patient } = useLocalSearchParams<{ id_patient: string }>();

  const [codeUnique, setCodeUnique] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidFormat = (code: string) => {
    // Format PAT-YYYY-XXX
    const pattern = /^PAT-\d{4}-\d+$/i;
    return pattern.test(code.trim());
  };

  const handleCodeChange = (text: string) => {
    const upperText = text.toUpperCase();
    setCodeUnique(upperText);
    setError('');
  };

  const handleVerifyCode = async () => {
    const code = codeUnique.trim().toUpperCase();

    if (!code) {
      setError('Veuillez entrer votre code unique');
      return;
    }

    if (!isValidFormat(code)) {
      setError('Format invalide. Le code doit être au format PAT-YYYY-XXX');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await verifyPatientCode(id_patient, code);

      if (response.success || response.patient) {
        Alert.alert(
          '✅ Code validé !', 
          'Accès autorisé à votre dossier médical.', 
          [
            {
              text: 'Voir mon dossier',
              onPress: () => {
                router.replace({
                  pathname: '/(doctor)/patient-profile',
                  params: {
                    id: id_patient,
                    readOnly: 'true',
                  },
                });
              },
            },
          ]
        );
      } else {
        setError(response.message || 'Le code saisi est incorrect');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Impossible de vérifier le code';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header avec icône */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={48} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Accès sécurisé</Text>
          <Text style={styles.subtitle}>
            Entrez le code unique fourni par votre médecin pour accéder à votre dossier médical
          </Text>
        </View>

        {/* Carte de saisie */}
        <View style={styles.card}>
          <View style={styles.inputHeader}>
            <Lock size={20} color={Colors.gray} />
            <Text style={styles.inputLabel}>Code unique patient</Text>
          </View>

          <TextInput
            style={[
              styles.input,
              error && styles.inputError,
              isValidFormat(codeUnique) && styles.inputValid,
            ]}
            placeholder="PAT-2025-XXX"
            value={codeUnique}
            onChangeText={handleCodeChange}
            autoCapitalize="characters"
            editable={!loading}
            placeholderTextColor="#9ca3af"
            maxLength={20}
          />

          {/* Feedback visuel */}
          {codeUnique.length > 0 && (
            <View style={styles.feedback}>
              {isValidFormat(codeUnique) ? (
                <View style={styles.feedbackSuccess}>
                  <CheckCircle size={16} color="#10b981" />
                  <Text style={styles.feedbackSuccessText}>Format valide</Text>
                </View>
              ) : (
                <View style={styles.feedbackWarning}>
                  <AlertCircle size={16} color="#f59e0b" />
                  <Text style={styles.feedbackWarningText}>
                    Format attendu : PAT-YYYY-XXX
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Message d'erreur */}
          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={18} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Bouton de validation */}
          <Button
            title={loading ? 'Vérification...' : 'Valider mon code'}
            onPress={handleVerifyCode}
            disabled={loading || !isValidFormat(codeUnique)}
            variant="primary"
            style={styles.button}
          />

          {loading && (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
          )}
        </View>

        {/* Instructions */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Où trouver mon code ?</Text>
          <Text style={styles.infoText}>
            • Votre médecin vous a communiqué ce code lors de votre dernière consultation{'\n'}
            • Il figure également sur vos documents médicaux{'\n'}
            • En cas de perte, contactez votre médecin
          </Text>
        </View>

        {/* Bouton retour */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.gray,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    fontWeight: '600',
    color: Colors.text,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputValid: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  feedback: {
    marginBottom: 16,
  },
  feedbackSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  feedbackSuccessText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },
  feedbackWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
  },
  feedbackWarningText: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  button: {
    marginTop: 8,
  },
  loader: {
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 20,
  },
  backButton: {
    alignSelf: 'center',
    padding: 12,
  },
  backButtonText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
});