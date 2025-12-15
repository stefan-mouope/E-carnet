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
          <Text style={styles.title}>Ravi de vous revoir ! 💝</Text>
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
              <Lock size={18} color="#f43f5e" />
            </View>
            <Text style={styles.formTitle}>Connexion sécurisée</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Identifiant</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Mail size={20} color="#f43f5e" />
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
                <Lock size={20} color="#f43f5e" />
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
              <Text style={styles.infoIcon}>💗</Text>
              <Text style={styles.infoText}>
                Un code unique vous sera demandé après connexion pour accéder à votre dossier
              </Text>
            </View>
          )}

          {/* BOUTON */}
          <Button 
            title={loading ? '⏳ Connexion...' : '🌸 Me connecter'} 
            onPress={handleLogin} 
            disabled={loading}
            style={styles.loginButton}
          />

          {loading && (
            <ActivityIndicator 
              size="large" 
              color="#f43f5e" 
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
    marginBottom: 32,
    marginTop: 10,
  },

  logoWrapper: {
    position: 'relative',
    marginBottom: 20,
  },

  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f43f5e',
    opacity: 0.2,
    top: -10,
    left: -10,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f43f5e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
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
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  roleSection: {
    marginBottom: 24,
  },

  roleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  roleCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fecdd3',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  roleCardActive: {
    borderColor: '#f43f5e',
    backgroundColor: '#fff1f2',
    borderWidth: 3,
  },

  roleContent: {
    alignItems: 'center',
  },

  roleIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffe4e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  roleIconActive: {
    backgroundColor: '#f43f5e',
  },

  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },

  roleTitleActive: {
    color: '#f43f5e',
  },

  roleSubtitle: {
    fontSize: 12,
    color: '#f43f5e',
    fontWeight: '600',
  },

  activeIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  checkIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  formContainer: {
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

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },

  formIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffe4e6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },

  inputGroup: {
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },

  inputWrapper: {
    position: 'relative',
  },

  inputIconContainer: {
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 1,
  },

  styledInput: {
    paddingLeft: 46,
    backgroundColor: '#fff5f7',
    borderColor: '#fecdd3',
    borderWidth: 2,
    borderRadius: 12,
  },

  patientInfo: {
    flexDirection: 'row',
    backgroundColor: '#fff1f2',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#fb7185',
  },

  infoIcon: {
    fontSize: 20,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#881337',
    lineHeight: 18,
    fontWeight: '500',
  },

  loginButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#f43f5e',
  },

  loadingSpinner: {
    marginTop: 16,
  },

  supportSection: {
    marginTop: 10,
  },

  supportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecdd3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  supportQuestion: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500',
  },

  supportButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff1f2',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f43f5e',
  },

  supportButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f43f5e',
  },
});