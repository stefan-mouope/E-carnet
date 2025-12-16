import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import Button from '@/components/Button';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* LOGO ET TITRE */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Heart size={44} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
        </View>
        <Text style={styles.appName}>Topitoh</Text>
        <Text style={styles.tagline}>Votre santé, simplifiée</Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.content}>
        <Button
          title="Se connecter"
          onPress={() => router.push('/login')}
          style={styles.primaryButton}
        />

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Vous êtes médecin ?</Text>
          <View style={styles.line} />
        </View>

        <Button
          title="Créez votre compte"
          onPress={() => router.push('/register-doctor')}
          variant="outline"
          style={styles.secondaryButton}
        />
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Topitoh</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },

  header: {
    alignItems: 'center',
    paddingTop: 40,
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },

  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1.5,
  },

  tagline: {
    fontSize: 18,
    color: '#BFDBFE',
  },

  content: {
    paddingHorizontal: 32,
    gap: 20,
  },

  primaryButton: {
    backgroundColor: '#3B82F6',
    height: 56,
    borderRadius: 16,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  dividerText: {
    fontSize: 14,
    color: '#BFDBFE',
    marginHorizontal: 16,
    fontWeight: '500',
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    height: 56,
    borderRadius: 16,
  },

  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },

  footerText: {
    fontSize: 12,
    color: '#93C5FD',
  },
});