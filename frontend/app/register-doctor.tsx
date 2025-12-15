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
          <Text style={styles.title}>Bienvenue Docteur ! 🩺</Text>
          <Text style={styles.subtitle}>
            Créez votre espace professionnel en quelques étapes
          </Text>
        </View>

        {/* SECTION INFORMATIONS PERSONNELLES */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <User size={20} color="#f43f5e" />
            </View>
            <Text style={styles.sectionTitle}>Vos informations</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                placeholder=""
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
                placeholder=""
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
              <Mail size={20} color="#ec4899" />
            </View>
            <Text style={styles.sectionTitle}>Identifiants de connexion</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <View style={styles.inputWrapper}>
              <Input
                label=""
                placeholder=""
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
                    <CheckCircle size={16} color="#ec4899" />
                    <Text style={styles.successText}>Mot de passe fort ✓</Text>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#fb7185" />
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
                placeholder="Minimum 8 caractères"
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
                    <CheckCircle size={16} color="#ec4899" />
                    <Text style={styles.successText}>Parfait ! Les mots de passe correspondent</Text>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#f43f5e" />
                    <Text style={styles.errorText}>Les mots de passe sont différents</Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        {/* NOTICE DE CONFIDENTIALITÉ */}
        <View style={styles.privacyBox}>
          <Text style={styles.privacyIcon}>💗</Text>
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Vos données sont protégées</Text>
            <Text style={styles.privacyText}>
              Cryptage de bout en bout • Conformité RGPD • Normes médicales
            </Text>
          </View>
        </View>

        {/* BOUTON D'INSCRIPTION */}
        <Button 
          title={loading ? '⏳ Création du compte...' : '🌸 Créer mon compte'} 
          onPress={handleRegister} 
          disabled={loading || !passwordsMatch || !isPasswordStrong(password)}
          style={styles.registerButton}
        />

        {loading && (
          <ActivityIndicator 
            size="large" 
            color="#f43f5e" 
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
    backgroundColor: '#fff5f7',
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
    backgroundColor: '#f43f5e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#f43f5e',
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
    borderColor: '#fecdd3',
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
    backgroundColor: '#fff1f2',
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
    backgroundColor: '#fff5f7',
    borderColor: '#fecdd3',
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
    backgroundColor: '#fce4ec',
    borderWidth: 1,
    borderColor: '#f9a8d4',
  },

  warningBadge: {
    backgroundColor: '#ffe4e6',
    borderWidth: 1,
    borderColor: '#fda4af',
  },

  errorBadge: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fda4af',
  },

  successText: {
    fontSize: 13,
    color: '#ec4899',
    fontWeight: '600',
    flex: 1,
  },

  warningText: {
    fontSize: 13,
    color: '#fb7185',
    fontWeight: '600',
    flex: 1,
  },

  errorText: {
    fontSize: 13,
    color: '#f43f5e',
    fontWeight: '600',
    flex: 1,
  },

  privacyBox: {
    flexDirection: 'row',
    backgroundColor: '#ffe4e6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 2,
    borderColor: '#fecdd3',
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
    color: '#881337',
    marginBottom: 4,
  },

  privacyText: {
    fontSize: 12,
    color: '#9f1239',
    lineHeight: 18,
  },

  registerButton: {
    marginBottom: 16,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f43f5e',
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
    color: '#f43f5e',
    textDecorationLine: 'underline',
  },
});