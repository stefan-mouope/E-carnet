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
    paddingBottom: 40,
  },

  /* ================= HERO ================= */
  heroSection: {
    paddingTop: 72,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  decorativeCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#dbeafe',
    opacity: 0.45,
    top: -60,
    right: -60,
  },

  decorativeCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#bfdbfe',
    opacity: 0.35,
    bottom: -10,
    left: -40,
  },

  logoContainer: {
    marginBottom: 28,
    zIndex: 1,
  },

  logoOuter: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 10,
  },

  logoInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10,
    letterSpacing: -1.2,
  },

  tagline: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 24,
    paddingHorizontal: 28,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 6,
  },

  /* ================= FEATURES ================= */
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  featuresTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 26,
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  featureCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },

  featureText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },

  /* ================= CTA ================= */
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  ctaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },

  doctorCard: {
    borderColor: '#c7d2fe',
    backgroundColor: '#f8fafc',
  },

  ctaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  ctaEmoji: {
    fontSize: 38,
    marginRight: 14,
  },

  ctaTextContainer: {
    flex: 1,
  },

  ctaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },

  ctaSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },

  primaryButton: {
    backgroundColor: '#6366f1',
    height: 54,
    borderRadius: 16,
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: '#6366f1',
    backgroundColor: '#ffffff',
    height: 54,
    borderRadius: 16,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#cbd5e1',
  },

  dividerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginHorizontal: 16,
  },

  /* ================= FOOTER ================= */
  footer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
    alignItems: 'center',
  },

  footerBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 18,
  },

  footerBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 4,
    marginVertical: 4,
  },

  footerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },

  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
