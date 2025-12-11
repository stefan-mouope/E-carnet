import { useState, useEffect } from 'react'; // Importer useState et useEffect
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'; // Importer ActivityIndicator
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { getPatientMe } from '@/services/api'; // Importer la fonction API
import { Patient } from '@/types'; // Importer le type Patient
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage

export default function DossierPatient() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer le uniqueCode du patient connecté (depuis AsyncStorage ou autre)
        const storedUniqueCode = await AsyncStorage.getItem('patientUniqueCode');
        const patientUniqueCode = storedUniqueCode || 'PAT-2024-001'; // Placeholder, à remplacer par le vrai code

        if (!patientUniqueCode) {
          setError('Code unique du patient non disponible.');
          setLoading(false);
          return;
        }

        const patientResponse = await getPatientMe(patientUniqueCode);
        setPatient(patientResponse.patient);
      } catch (err: any) {
        console.error("Failed to fetch patient dossier data:", err);
        setError(err.response?.data?.message || 'Erreur lors du chargement du dossier du patient.');
        Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement du dossier du patient.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Mon Dossier Médical" onBack={() => router.back()} />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={styles.container}>
        <Header title="Mon Dossier Médical" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Dossier du patient non disponible.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mon Dossier Médical" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Identité</Text>
            <Badge text={patient.bloodType} variant="error" />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nom complet:</Text>
            <Text style={styles.value}>{patient.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Code unique:</Text>
            <Text style={styles.codeValue}>{patient.uniqueCode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date de création:</Text>
            <Text style={styles.value}>{patient.createdAt}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Informations physiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Âge</Text>
              <Text style={styles.statValue}>{patient.age}</Text>
              <Text style={styles.statUnit}>ans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Poids</Text>
              <Text style={styles.statValue}>{patient.weight}</Text>
              <Text style={styles.statUnit}>kg</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Taille</Text>
              <Text style={styles.statValue}>{patient.height}</Text>
              <Text style={styles.statUnit}>cm</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Antécédents médicaux</Text>
          <Text style={styles.historyText}>{patient.medicalHistory}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Groupe sanguin</Text>
          <View style={styles.bloodTypeContainer}>
            <Badge text={patient.bloodType} variant="error" />
            <Text style={styles.bloodTypeInfo}>
              Information importante pour les urgences médicales
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  label: {
    fontSize: 14,
    color: Colors.gray,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  codeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  statUnit: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  historyText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  bloodTypeContainer: {
    alignItems: 'flex-start',
  },
  bloodTypeInfo: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 8,
    lineHeight: 18,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 20,
  },
});
