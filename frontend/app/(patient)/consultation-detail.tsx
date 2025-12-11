import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { getConsultationsForPatient, getPatientMe } from '@/services/api'; // Importez les fonctions API
import { Consultation, Patient } from '@/types'; // Importez les types
import { Calendar, User, Stethoscope, Pill, FileText, ClipboardList } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConsultationDetailPatient() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // id de la consultation

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer le uniqueCode du patient connecté
        const storedUniqueCode = await AsyncStorage.getItem('patientUniqueCode');
        const patientUniqueCode = storedUniqueCode || 'PAT-2024-001'; // Placeholder

        if (!patientUniqueCode) {
          setError('Code unique du patient non disponible.');
          setLoading(false);
          return;
        }

        const patientResponse = await getPatientMe(patientUniqueCode);
        const currentPatientId = patientResponse.patient.id;

        const consultationsResponse = await getConsultationsForPatient(currentPatientId);
        const foundConsultation = consultationsResponse.consultations.find(
          (c: Consultation) => c.id === id
        );

        if (foundConsultation) {
          setConsultation(foundConsultation);
        } else {
          setError('Consultation non trouvée.');
        }
      } catch (err: any) {
        console.error("Failed to fetch consultation details:", err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des détails de la consultation.');
        Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement des détails de la consultation.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError('ID de consultation manquant.');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Détail consultation" onBack={() => router.back()} />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      </View>
    );
  }

  if (error || !consultation) {
    return (
      <View style={styles.container}>
        <Header title="Détail consultation" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Consultation non trouvée'}</Text>
          {error && <Button title="Réessayer" onPress={() => router.replace('/(patient)/consultations')} />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Détail consultation" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card>
          <View style={styles.infoRow}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{consultation.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <User size={20} color={Colors.primary} />
            <Text style={styles.infoLabel}>Docteur:</Text>
            <Text style={styles.infoValue}>{consultation.doctorName}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Symptômes</Text>
          <Text style={styles.contentText}>{consultation.symptoms}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Diagnostic</Text>
          <Text style={styles.contentText}>{consultation.diagnosis}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Traitement</Text>
          <Text style={styles.contentText}>{consultation.treatment}</Text>
        </Card>

        {consultation.prescription && (
          <Card>
            <Text style={styles.sectionTitle}>Ordonnance</Text>
            <Text style={styles.contentText}>{consultation.prescription}</Text>
          </Card>
        )}

        {consultation.notes && (
          <Card>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.contentText}>{consultation.notes}</Text>
          </Card>
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
});
