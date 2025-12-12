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
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Briefcase size={32} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Inscription Docteur</Text>
          <Text style={styles.subtitle}>
            Créez votre compte professionnel pour accéder à la plateforme
          </Text>
        </View>

        {/* FORMULAIRE */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Informations personnelles</Text>
          
          {/* Nom complet */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <User size={20} color={Colors.gray} />
            </View>
            <Input
              label=""
              placeholder="Dr. Jean Dupont"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          {/* Spécialité */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Briefcase size={20} color={Colors.gray} />
            </View>
            <Input
              label=""
              placeholder="Médecine générale, Cardiologie..."
              value={specialty}
              onChangeText={setSpecialty}
              style={styles.input}
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Identifiants de connexion</Text>

          {/* Nom d'utilisateur */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Mail size={20} color={Colors.gray} />
            </View>
            <Input
              label=""
              placeholder="dr.dupont"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* Mot de passe */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Lock size={20} color={Colors.gray} />
            </View>
            <Input
              label=""
              placeholder="Mot de passe (min. 8 caractères)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Indicateur de force du mot de passe */}
          {showPasswordStrength && (
            <View style={styles.validationBox}>
              {isPasswordStrong(password) ? (
                <View style={styles.validationSuccess}>
                  <CheckCircle size={16} color="#10b981" />
                  <Text style={styles.validationSuccessText}>
                    Mot de passe suffisamment fort
                  </Text>
                </View>
              ) : (
                <View style={styles.validationError}>
                  <AlertCircle size={16} color="#ef4444" />
                  <Text style={styles.validationErrorText}>
                    Le mot de passe doit contenir au moins 8 caractères
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Confirmation du mot de passe */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Lock size={20} color={Colors.gray} />
            </View>
            <Input
              label=""
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Indicateur de correspondance des mots de passe */}
          {showPasswordMatch && (
            <View style={styles.validationBox}>
              {passwordsMatch ? (
                <View style={styles.validationSuccess}>
                  <CheckCircle size={16} color="#10b981" />
                  <Text style={styles.validationSuccessText}>
                    Les mots de passe correspondent
                  </Text>
                </View>
              ) : (
                <View style={styles.validationError}>
                  <AlertCircle size={16} color="#ef4444" />
                  <Text style={styles.validationErrorText}>
                    Les mots de passe ne correspondent pas
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Informations importantes */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              🔒 Vos données sont sécurisées et conformes aux normes médicales
            </Text>
          </View>

          {/* Bouton d'inscription */}
          <Button 
            title={loading ? 'Création du compte...' : 'Créer mon compte'} 
            onPress={handleRegister} 
            disabled={loading || !passwordsMatch || !isPasswordStrong(password)}
            style={styles.registerButton}
          />

          {loading && (
            <ActivityIndicator 
              size="small" 
              color={Colors.primary} 
              style={styles.loader} 
            />
          )}
        </View>

        {/* Lien vers connexion */}
        <View style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Vous avez déjà un compte ?</Text>
          <Text style={styles.loginLinkButton} onPress={() => router.back()}>
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
    backgroundColor: '#f8fafc',
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
    marginTop: 10,
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },

  inputIconContainer: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },

  input: {
    paddingLeft: 48,
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },

  validationBox: {
    marginBottom: 16,
  },

  validationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },

  validationSuccessText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },

  validationError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },

  validationErrorText: {
    flex: 1,
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },

  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },

  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
  },

  registerButton: {
    marginTop: 8,
  },

  loader: {
    marginTop: 16,
  },

  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },

  loginLinkText: {
    fontSize: 14,
    color: Colors.gray,
  },

  loginLinkButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});