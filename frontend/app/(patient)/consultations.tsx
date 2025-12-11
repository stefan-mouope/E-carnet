import { useState, useEffect } from 'react'; // Importer useEffect
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'; // Importer ActivityIndicator
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { getConsultationsForPatient, getPatientMe } from '@/services/api'; // Importer les fonctions API
import { Consultation, Patient } from '@/types'; // Importer les types
import { Calendar, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConsultationsListPatient() {
  const router = useRouter();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
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
        const currentPatientId = patientResponse.patient.id;
        setPatientId(currentPatientId);

        const consultationsResponse = await getConsultationsForPatient(currentPatientId);
        setConsultations(consultationsResponse.consultations);
      } catch (err: any) {
        console.error("Failed to fetch patient consultations:", err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des consultations.');
        Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement des consultations.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Mes Consultations" onBack={() => router.back()} />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      </View>
    );
  }

  if (error || !patientId) {
    return (
      <View style={styles.container}>
        <Header title="Mes Consultations" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error || 'Consultations non disponibles.'}</Text>
          <Button title="Réessayer" onPress={() => router.replace('/(patient)/consultations')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mes Consultations" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {consultations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune consultation</Text>
          </View>
        ) : (
          consultations.map((consultation) => (
            <Card
              key={consultation.id}
              onPress={() =>
                router.push({
                  pathname: '/(patient)/consultation-detail',
                  params: { id: consultation.id },
                })
              }
            >
              <View style={styles.consultationHeader}>
                <View style={styles.dateContainer}>
                  <Calendar size={16} color={Colors.primary} />
                  <Text style={styles.date}>{consultation.date}</Text>
                </View>
              </View>
              <View style={styles.doctorContainer}>
                <User size={16} color={Colors.gray} />
                <Text style={styles.doctorName}>{consultation.doctorName}</Text>
              </View>
              <Text style={styles.diagnosis} numberOfLines={2}>
                {consultation.diagnosis}
              </Text>
            </Card>
          ))
        )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  doctorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 14,
    color: Colors.gray,
  },
  diagnosis: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});
