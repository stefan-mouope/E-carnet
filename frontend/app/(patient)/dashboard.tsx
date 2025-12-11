import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'; // Importer ActivityIndicator
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { getPatientMe, getConsultationsForPatient, logout } from '@/services/api'; // Importer les fonctions API
import { Patient, Consultation } from '@/types'; // Importer les types
import { User, FileText, Calendar, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importer AsyncStorage

export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Il faut récupérer le uniqueCode du patient connecté. Pour l'instant, c'est un placeholder.
        // Idéalement, le login devrait retourner le uniqueCode ou il devrait être stocké.
        const storedUniqueCode = await AsyncStorage.getItem('patientUniqueCode');
        const patientUniqueCode = storedUniqueCode || 'PAT-2024-001'; // Placeholder, à remplacer par le vrai code

        if (!patientUniqueCode) {
          setError('Code unique du patient non disponible.');
          setLoading(false);
          return;
        }

        const patientResponse = await getPatientMe(patientUniqueCode);
        setPatient(patientResponse.patient);

        const consultationsResponse = await getConsultationsForPatient(patientResponse.patient.id);
        setConsultations(consultationsResponse.consultations);
      } catch (err: any) {
        console.error("Failed to fetch patient dashboard data:", err);
        setError(err.response?.data?.message || 'Erreur lors du chargement du tableau de bord du patient.');
        Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement du tableau de bord du patient.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout(); // Utiliser la fonction de déconnexion du service API
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Button title="Déconnexion" onPress={handleLogout} variant="outline" />
        </View>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>Erreur</Text>
          <Button title="Déconnexion" onPress={handleLogout} variant="outline" />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Données du patient non disponibles.'}</Text>
          <Button title="Réessayer" onPress={() => router.replace('/(patient)/dashboard')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.name}>{patient.name}</Text>
        </View>
        <Button title="Déconnexion" onPress={handleLogout} variant="outline" />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card>
          <View style={styles.infoHeader}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            <Badge text={patient.bloodType} variant="error" />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Âge:</Text>
            <Text style={styles.infoValue}>{patient.age} ans</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Poids:</Text>
            <Text style={styles.infoValue}>{patient.weight} kg</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Taille:</Text>
            <Text style={styles.infoValue}>{patient.height} cm</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Code unique:</Text>
            <Text style={styles.codeValue}>{patient.uniqueCode}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Antécédents médicaux</Text>
          <Text style={styles.historyText}>{patient.medicalHistory}</Text>
        </Card>

        <View style={styles.menuGrid}>
          <Card onPress={() => router.push('/(patient)/consultations')}>
            <View style={styles.menuItem}>
              <Calendar size={32} color={Colors.primary} />
              <Text style={styles.menuTitle}>Mes consultations</Text>
              <Text style={styles.menuSubtitle}>
                {consultations.length} consultation(s)
              </Text>
            </View>
          </Card>

          <Card onPress={() => router.push('/(patient)/dossier')}>
            <View style={styles.menuItem}>
              <FileText size={32} color={Colors.secondary} />
              <Text style={styles.menuTitle}>Mon dossier</Text>
              <Text style={styles.menuSubtitle}>Voir le dossier complet</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: Colors.gray,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  codeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  historyText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  menuItem: {
    alignItems: 'center',
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
    textAlign: 'center',
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
