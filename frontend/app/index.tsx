import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import { Heart, Shield, Clock, Users } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* HEADER AVEC GRADIENT VISUEL */}
      <View style={styles.heroSection}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Heart size={44} color="#ffffff" strokeWidth={2.5} fill="#ffffff" />
            </View>
          </View>
        </View>

        <Text style={styles.appName}>Topitoh</Text>
        <Text style={styles.tagline}>Votre santé, toujours à portée de main</Text>
        
        <View style={styles.badge}>
          <Shield size={14} color="#10b981" />
          <Text style={styles.badgeText}>Sécurisé & Confidentiel</Text>
        </View>
      </View>

      {/* FEATURES CARDS */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Pourquoi choisir Topitoh ?</Text>
        
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#dbeafe' }]}>
              <Heart size={24} color="#3b82f6" strokeWidth={2} />
            </View>
            <Text style={styles.featureTitle}>Dossier centralisé</Text>
            <Text style={styles.featureText}>Tous vos documents médicaux au même endroit</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#dcfce7' }]}>
              <Shield size={24} color="#10b981" strokeWidth={2} />
            </View>
            <Text style={styles.featureTitle}>Sécurité maximale</Text>
            <Text style={styles.featureText}>Cryptage et conformité RGPD garantis</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#fef3c7' }]}>
              <Clock size={24} color="#f59e0b" strokeWidth={2} />
            </View>
            <Text style={styles.featureTitle}>Accès instantané</Text>
            <Text style={styles.featureText}>Consultez votre historique 24h/24</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#e0e7ff' }]}>
              <Users size={24} color="#6366f1" strokeWidth={2} />
            </View>
            <Text style={styles.featureTitle}>Collaboration</Text>
            <Text style={styles.featureText}>Partagez avec vos médecins facilement</Text>
          </View>
        </View>
      </View>

      {/* CTA SECTION */}
      <View style={styles.ctaSection}>
        <View style={styles.ctaCard}>
          <View style={styles.ctaHeader}>
            <Text style={styles.ctaEmoji}>👤</Text>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Vous êtes patient ?</Text>
              <Text style={styles.ctaSubtitle}>Accédez à votre dossier médical</Text>
            </View>
          </View>
          <Button
            title="🔓 Se connecter"
            onPress={() => router.push('/login')}
            style={styles.primaryButton}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={[styles.ctaCard, styles.doctorCard]}>
          <View style={styles.ctaHeader}>
            <Text style={styles.ctaEmoji}>👨‍⚕️</Text>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Vous êtes médecin ?</Text>
              <Text style={styles.ctaSubtitle}>Rejoignez notre réseau professionnel</Text>
            </View>
          </View>
          <Button
            title="✨ Créer mon espace pro"
            onPress={() => router.push('/register-doctor')}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerBadges}>
          <View style={styles.footerBadge}>
            <Text style={styles.footerBadgeText}>🔒 Crypté E2E</Text>
          </View>
          <View style={styles.footerBadge}>
            <Text style={styles.footerBadgeText}>✓ RGPD</Text>
          </View>
          <View style={styles.footerBadge}>
            <Text style={styles.footerBadgeText}>🇫🇷 France</Text>
          </View>
        </View>
        <Text style={styles.footerText}>© 2024 Topitoh - Tous droits réservés</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#dbeafe',
    opacity: 0.5,
    top: -50,
    right: -50,
  },

  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#bfdbfe',
    opacity: 0.4,
    bottom: 0,
    left: -30,
  },

  logoContainer: {
    marginBottom: 24,
    zIndex: 1,
  },

  logoOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -1,
  },

  tagline: {
    fontSize: 17,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86efac',
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981',
  },

  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  featuresTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },

  featureCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },

  featureText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },

  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },

  ctaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  doctorCard: {
    borderColor: '#c7d2fe',
    backgroundColor: '#fafafa',
  },

  ctaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },

  ctaEmoji: {
    fontSize: 36,
  },

  ctaTextContainer: {
    flex: 1,
  },

  ctaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },

  ctaSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },

  primaryButton: {
    backgroundColor: '#6366f1',
    height: 52,
    borderRadius: 14,
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: '#6366f1',
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 14,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#cbd5e1',
  },

  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginHorizontal: 16,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: 'center',
  },

  footerBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },

  footerBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  footerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },

  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});