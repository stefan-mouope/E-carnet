import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import { registerDoctor } from '@/services/api';
import { User, Briefcase, Mail, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react-native';

export default function RegisterDoctorScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation de la force du mot de passe
  const isPasswordStrong = (pwd: string) => {
    return pwd.length >= 8;
  };

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const showPasswordStrength = password.length > 0;
  const showPasswordMatch = confirmPassword.length > 0;

  const handleRegister = async () => {
    if (!name || !username || !password || !confirmPassword || !specialty) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (!isPasswordStrong(password)) {
      Alert.alert('Mot de passe faible', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      await registerDoctor(name, specialty, username, password);
      Alert.alert(
        '✅ Compte créé avec succès !',
        'Vous pouvez maintenant vous connecter avec vos identifiants.',
        [{ text: 'Se connecter', onPress: () => router.back() }]
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
      Alert.alert('Erreur d\'inscription', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Créer un compte Docteur" onBack={() => router.back()} />
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER MODERNE */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Briefcase size={36} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View style={styles.iconGlow} />
          </View>
          <Text style={styles.title}>Rejoignez-nous</Text>
          <Text style={styles.subtitle}>
            Créez votre espace professionnel en quelques minutes
          </Text>
        </View>

        {/* SECTION INFORMATIONS PERSONNELLES */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <User size={18} color="#6366f1" strokeWidth={2.5} />
            </View>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                placeholder="Dr. Jean Dupont"
                value={name}
                onChangeText={setName}
                style={styles.styledInput}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Spécialité médicale</Text>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                placeholder="Ex: Cardiologie, Pédiatrie..."
                value={specialty}
                onChangeText={setSpecialty}
                style={styles.styledInput}
              />
            </View>
          </View>
        </View>

        {/* SECTION IDENTIFIANTS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, styles.sectionIconBoxGreen]}>
              <Lock size={18} color="#10b981" strokeWidth={2.5} />
            </View>
            <Text style={styles.sectionTitle}>Sécurité du compte</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                placeholder="dr.dupont"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.styledInput}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                placeholder="Minimum 8 caractères"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.styledInput}
              />
            </View>
            
            {showPasswordStrength && (
              <View style={[styles.statusBadge, isPasswordStrong(password) ? styles.successBadge : styles.warningBadge]}>
                {isPasswordStrong(password) ? (
                  <>
                    <CheckCircle size={16} color="#10b981" strokeWidth={2.5} />
                    <Text style={styles.successText}>Mot de passe sécurisé</Text>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#f59e0b" strokeWidth={2.5} />
                    <Text style={styles.warningText}>Minimum 8 caractères requis</Text>
                  </>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                placeholder="Retapez votre mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.styledInput}
              />
            </View>

            {showPasswordMatch && (
              <View style={[styles.statusBadge, passwordsMatch ? styles.successBadge : styles.errorBadge]}>
                {passwordsMatch ? (
                  <>
                    <CheckCircle size={16} color="#10b981" strokeWidth={2.5} />
                    <Text style={styles.successText}>Les mots de passe correspondent</Text>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#ef4444" strokeWidth={2.5} />
                    <Text style={styles.errorText}>Les mots de passe ne correspondent pas</Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        {/* NOTICE DE CONFIDENTIALITÉ */}
        <View style={styles.privacyBox}>
          <View style={styles.privacyIconBox}>
            <Shield size={20} color="#059669" strokeWidth={2.5} />
          </View>
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Vos données sont protégées</Text>
            <Text style={styles.privacyText}>
              Cryptage end-to-end • Conformité RGPD • Hébergement sécurisé
            </Text>
          </View>
        </View>

        {/* BOUTON D'INSCRIPTION */}
        <Button 
          title={loading ? 'Création en cours...' : 'Créer mon compte'} 
          onPress={handleRegister} 
          disabled={loading || !passwordsMatch || !isPasswordStrong(password)}
          style={[
            styles.registerButton,
            (loading || !passwordsMatch || !isPasswordStrong(password)) && styles.registerButtonDisabled
          ]}
        />

        {loading && (
          <ActivityIndicator 
            size="large" 
            color="#6366f1" 
            style={styles.loader} 
          />
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
          <Text style={styles.footerLink} onPress={() => router.back()}>
            Se connecter
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  
  content: {
    flex: 1,
  },
  
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },

  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },

  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    opacity: 0.2,
    top: 0,
    left: 0,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },

  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionIconBoxGreen: {
    backgroundColor: '#d1fae5',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.2,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  inputWrapper: {
    position: 'relative',
  },

  styledInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1.5,
    borderRadius: 12,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  successBadge: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#86efac',
  },

  warningBadge: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde047',
  },

  errorBadge: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },

  successText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    flex: 1,
  },

  warningText: {
    fontSize: 13,
    color: '#d97706',
    fontWeight: '600',
    flex: 1,
  },

  errorText: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '600',
    flex: 1,
  },

  privacyBox: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },

  privacyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  privacyContent: {
    flex: 1,
    paddingTop: 2,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 4,
  },

  privacyText: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },

  registerButton: {
    marginBottom: 16,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  registerButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },

  loader: {
    marginVertical: 16,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 20,
  },

  footerText: {
    fontSize: 15,
    color: '#64748b',
  },

  footerLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366f1',
  },
});