import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import { registerDoctor } from '@/services/api';
import { User, Briefcase, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react-native';

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
        {/* HEADER ACCUEILLANT */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Briefcase size={40} color="#ffffff" strokeWidth={2} />
          </View>
          <Text style={styles.title}>Bienvenue Docteur ! 👨‍⚕️</Text>
          <Text style={styles.subtitle}>
            Créez votre espace professionnel en quelques étapes
          </Text>
        </View>

        {/* SECTION INFORMATIONS PERSONNELLES */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <User size={20} color="#6366f1" />
            </View>
            <Text style={styles.sectionTitle}>Vos informations</Text>
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
                placeholder="Cardiologie, Médecine générale..."
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
            <View style={styles.sectionIconBox}>
              <Mail size={20} color="#10b981" />
            </View>
            <Text style={styles.sectionTitle}>Identifiants de connexion</Text>
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
                    <CheckCircle size={16} color="#10b981" />
                    <Text style={styles.successText}>Mot de passe fort ✓</Text>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#f59e0b" />
                    <Text style={styles.warningText}>8 caractères minimum</Text>
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
                    <CheckCircle size={16} color="#10b981" />
                    <Text style={styles.successText}>Parfait ! Les mots de passe correspondent</Text>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#ef4444" />
                    <Text style={styles.errorText}>Les mots de passe sont différents</Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        {/* NOTICE DE CONFIDENTIALITÉ */}
        <View style={styles.privacyBox}>
          <Text style={styles.privacyIcon}>🔐</Text>
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Vos données sont protégées</Text>
            <Text style={styles.privacyText}>
              Cryptage de bout en bout • Conformité RGPD • Normes médicales
            </Text>
          </View>
        </View>

        {/* BOUTON D'INSCRIPTION */}
        <Button 
          title={loading ? '⏳ Création du compte...' : '🚀 Créer mon compte'} 
          onPress={handleRegister} 
          disabled={loading || !passwordsMatch || !isPasswordStrong(password)}
          style={styles.registerButton}
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
            Connectez-vous ici
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  
  content: {
    flex: 1,
  },
  
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 30,
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },

  sectionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },

  inputWrapper: {
    position: 'relative',
  },

  styledInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 2,
    borderRadius: 12,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
  },

  successBadge: {
    backgroundColor: '#f0fdf4',
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
    color: '#10b981',
    fontWeight: '600',
    flex: 1,
  },

  warningText: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
    flex: 1,
  },

  errorText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '600',
    flex: 1,
  },

  privacyBox: {
    flexDirection: 'row',
    backgroundColor: '#fefce8',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 2,
    borderColor: '#fde047',
  },

  privacyIcon: {
    fontSize: 24,
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#854d0e',
    marginBottom: 4,
  },

  privacyText: {
    fontSize: 12,
    color: '#a16207',
    lineHeight: 18,
  },

  registerButton: {
    marginBottom: 16,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#6366f1',
  },

  loader: {
    marginVertical: 20,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 16,
  },

  footerText: {
    fontSize: 15,
    color: '#64748b',
  },

  footerLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366f1',
    textDecorationLine: 'underline',
  },
});