import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import { login } from '@/services/api'; 
import { User, Stethoscope, Lock, Mail } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await login(username, password, role);
      
      Alert.alert('✅ Connexion réussie', response.message, [
        {
          text: 'Continuer',
          onPress: () => {
            if (role === 'doctor') {
              router.replace('/(doctor)/dashboard');
            } else {
              router.replace(`/(patient)/VerifyCodeScreen?id_patient=${response.id_patient}`);
            }
          },
        },
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la connexion.';
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Connexion" onBack={() => router.back()} />
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* LOGO / TITRE */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Stethoscope size={40} color={Colors.primary} strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.title}>Bienvenue</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour accéder à votre espace
          </Text>
        </View>

        {/* SÉLECTEUR DE RÔLE */}
        <View style={styles.roleSelectorContainer}>
          <Text style={styles.sectionLabel}>Je suis</Text>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'patient' && styles.roleButtonActive]}
              onPress={() => setRole('patient')}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIcon, role === 'patient' && styles.roleIconActive]}>
                <User 
                  size={24} 
                  color={role === 'patient' ? 'white' : Colors.gray}
                  strokeWidth={2}
                />
              </View>
              <Text style={[styles.roleText, role === 'patient' && styles.roleTextActive]}>
                Patient
              </Text>
              {role === 'patient' && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkMarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, role === 'doctor' && styles.roleButtonActive]}
              onPress={() => setRole('doctor')}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIcon, role === 'doctor' && styles.roleIconActive]}>
                <Stethoscope 
                  size={24} 
                  color={role === 'doctor' ? 'white' : Colors.gray}
                  strokeWidth={2}
                />
              </View>
              <Text style={[styles.roleText, role === 'doctor' && styles.roleTextActive]}>
                Docteur
              </Text>
              {role === 'doctor' && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkMarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* FORMULAIRE DE CONNEXION */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Informations de connexion</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={Colors.gray} />
            </View>
            <Input
              label=""
              placeholder="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={Colors.gray} />
            </View>
            <Input
              label=""
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* INFO POUR PATIENT */}
          {role === 'patient' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ℹ️ Après connexion, vous devrez saisir votre code unique pour accéder à votre dossier médical
              </Text>
            </View>
          )}

          {/* BOUTON DE CONNEXION */}
          <Button 
            title={loading ? 'Connexion en cours...' : 'Se connecter'} 
            onPress={handleLogin} 
            disabled={loading}
            style={styles.loginButton}
          />

          {loading && (
            <ActivityIndicator 
              size="small" 
              color={Colors.primary} 
              style={styles.loader} 
            />
          )}
        </View>

        {/* AIDE */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Besoin d'aide pour vous connecter ?
          </Text>
          <TouchableOpacity>
            <Text style={styles.helpLink}>Contactez le support</Text>
          </TouchableOpacity>
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
    marginTop: 20,
  },

  logoContainer: {
    marginBottom: 20,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },

  roleSelectorContainer: {
    marginBottom: 24,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  roleSelector: {
    flexDirection: 'row',
    gap: 12,
  },

  roleButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  roleButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#eff6ff',
  },

  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  roleIconActive: {
    backgroundColor: Colors.primary,
  },

  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray,
  },

  roleTextActive: {
    color: Colors.primary,
  },

  checkMark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkMarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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

  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },

  input: {
    paddingLeft: 48,
  },

  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },

  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
  },

  loginButton: {
    marginTop: 8,
  },

  loader: {
    marginTop: 16,
  },

  helpContainer: {
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },

  helpText: {
    fontSize: 14,
    color: Colors.gray,
  },

  helpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});