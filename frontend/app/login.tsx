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
        {/* HEADER CHALEUREUX */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoGlow} />
            <View style={styles.logoCircle}>
              <Stethoscope size={44} color="#ffffff" strokeWidth={2.5} />
            </View>
          </View>
          <Text style={styles.title}>Ravi de vous revoir ! 👋</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour accéder à vos services médicaux
          </Text>
        </View>

        {/* SÉLECTEUR DE RÔLE MODERNE */}
        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>Vous êtes :</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'patient' && styles.roleCardActive]}
              onPress={() => setRole('patient')}
              activeOpacity={0.8}
            >
              <View style={styles.roleContent}>
                <View style={[styles.roleIconCircle, role === 'patient' && styles.roleIconActive]}>
                  <User 
                    size={28} 
                    color={role === 'patient' ? '#ffffff' : '#94a3b8'}
                    strokeWidth={2.5}
                  />
                </View>
                <Text style={[styles.roleTitle, role === 'patient' && styles.roleTitleActive]}>
                  Patient
                </Text>
                {role === 'patient' && <Text style={styles.roleSubtitle}>Gérer ma santé</Text>}
              </View>
              {role === 'patient' && (
                <View style={styles.activeIndicator}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'doctor' && styles.roleCardActive]}
              onPress={() => setRole('doctor')}
              activeOpacity={0.8}
            >
              <View style={styles.roleContent}>
                <View style={[styles.roleIconCircle, role === 'doctor' && styles.roleIconActive]}>
                  <Stethoscope 
                    size={28} 
                    color={role === 'doctor' ? '#ffffff' : '#94a3b8'}
                    strokeWidth={2.5}
                  />
                </View>
                <Text style={[styles.roleTitle, role === 'doctor' && styles.roleTitleActive]}>
                  Médecin
                </Text>
                {role === 'doctor' && <Text style={styles.roleSubtitle}>Espace pro</Text>}
              </View>
              {role === 'doctor' && (
                <View style={styles.activeIndicator}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* FORMULAIRE COLORÉ */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <View style={styles.formIconBox}>
              <Lock size={18} color="#10b981" />
            </View>
            <Text style={styles.formTitle}>Connexion sécurisée</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Identifiant</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Mail size={20} color="#6366f1" />
              </View>
              <Input
                label=""
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.styledInput}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color="#6366f1" />
              </View>
              <Input
                label=""
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.styledInput}
              />
            </View>
          </View>

          {/* INFO PATIENT */}
          {role === 'patient' && (
            <View style={styles.patientInfo}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                Un code unique vous sera demandé après connexion pour accéder à votre dossier
              </Text>
            </View>
          )}

          {/* BOUTON */}
          <Button 
            title={loading ? '⏳ Connexion...' : '🔓 Me connecter'} 
            onPress={handleLogin} 
            disabled={loading}
            style={styles.loginButton}
          />

          {loading && (
            <ActivityIndicator 
              size="large" 
              color="#6366f1" 
              style={styles.loadingSpinner} 
            />
          )}
        </View>

        {/* AIDE */}
        <View style={styles.supportSection}>
          <View style={styles.supportCard}>
            <Text style={styles.supportQuestion}>Besoin d'aide ?</Text>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>💬 Contacter le support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef3f2',
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
    marginBottom: 36,
    marginTop: 20,
  },

  logoWrapper: {
    position: 'relative',
    marginBottom: 24,
  },

  logoGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#ff6b6b',
    opacity: 0.15,
    top: -15,
    left: -15,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2d1b1b',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: '#6b5555',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '500',
  },

  roleSection: {
    marginBottom: 28,
  },

  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a3535',
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 14,
  },

  roleCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#fde4e3',
    position: 'relative',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  roleCardActive: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },

  roleContent: {
    alignItems: 'center',
  },

  roleIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  roleIconActive: {
    backgroundColor: '#ff6b6b',
  },

  roleTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#8b6b6b',
    marginBottom: 4,
  },

  roleTitleActive: {
    color: '#ff6b6b',
  },

  roleSubtitle: {
    fontSize: 13,
    color: '#ff6b6b',
    fontWeight: '600',
  },

  activeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  checkIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: '#fde4e3',
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  formIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  formTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#2d1b1b',
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4a3535',
    marginBottom: 10,
  },

  inputWrapper: {
    position: 'relative',
  },

  inputIconContainer: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },

  styledInput: {
    paddingLeft: 50,
    backgroundColor: '#fef9f9',
    borderColor: '#fde4e3',
    borderWidth: 2,
    borderRadius: 16,
    fontSize: 16,
  },

  patientInfo: {
    flexDirection: 'row',
    backgroundColor: '#fef7e6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 22,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
  },

  infoIcon: {
    fontSize: 22,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
    fontWeight: '600',
  },

  loginButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  loadingSpinner: {
    marginTop: 20,
  },

  supportSection: {
    marginTop: 12,
  },

  supportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fde4e3',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  supportQuestion: {
    fontSize: 15,
    color: '#6b5555',
    marginBottom: 14,
    fontWeight: '600',
  },

  supportButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },

  supportButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ff6b6b',
  },
});