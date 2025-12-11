// DoctorDashboard.tsx
import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Users, UserPlus, Calendar } from 'lucide-react-native';
import { getDoctorPatients, getConsultationsForPatient, getUserFromToken } from '@/services/api';

export interface Patient {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  bloodType: string;
  medicalHistory: string;
  uniqueCode: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
}

export default function DoctorDashboard() {
  const router = useRouter();

  const [doctorName, setDoctorName] = useState<string>('Dr. Nom du Docteur');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalConsultations, setTotalConsultations] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          const currentDoctor = await getUserFromToken();

          if (currentDoctor && currentDoctor.name) {
            setDoctorName(`Dr. ${currentDoctor.name}`);
          } else {
            console.warn('Nom du docteur non trouvé dans le token');
          }

          const patientsResponse = await getDoctorPatients();
          const normalizedPatients: Patient[] = patientsResponse.patients.map((p: any) => ({
            id: String(p.id_patient),
            name: p.nom,
            age: p.age ?? 0,
            weight: p.poids ?? 0,
            height: p.taille ?? 0,
            bloodType: p.groupe_sanguin ?? '',
            medicalHistory: p.antecedents ?? '',
            uniqueCode: p.code_unique,
            createdAt: p.createdAt,
          }));

          setPatients(normalizedPatients);

          const patientMap: Record<string, { latest: Consultation; count: number }> = {};

          for (const patient of normalizedPatients) {
            const consultsResponse = await getConsultationsForPatient(patient.id);
            const normalizedConsults: Consultation[] = consultsResponse.consultations.map((c: any) => ({
              id: String(c.id),
              patientId: String(c.patient_id),
              patientName: patient.name,
              doctorId: String(c.doctor_id),
              doctorName: c.doctorName ?? 'Dr.',
              date: c.date,
              symptoms: c.symptoms ?? '',
              diagnosis: c.diagnosis ?? '',
              treatment: c.treatment ?? '',
              prescription: c.prescription ?? '',
              notes: c.notes ?? '',
            }));

            if (normalizedConsults.length > 0) {
              normalizedConsults.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              );

              patientMap[patient.id] = {
                latest: normalizedConsults[0],
                count: normalizedConsults.length,
              };
            }
          }

          const total = Object.values(patientMap).reduce((acc, v) => acc + v.count, 0);
          const recentGrouped: Consultation[] = Object.values(patientMap).map((v) => ({
            ...v.latest,
            diagnosis: `${v.latest.diagnosis} (${v.count} Consultation${v.count > 1 ? 's' : ''})`,
          }));

          setTotalConsultations(total);
          setRecentConsultations(recentGrouped);
        } catch (err: any) {
          console.error(err);
          setError(err.response?.data?.message || 'Erreur lors du chargement du tableau de bord.');
          Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement du tableau de bord.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.name}>{doctorName}</Text>
        </View>
        <Button title="Déconnexion" onPress={handleLogout} variant="outline" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Réessayer" onPress={() => router.replace('/(doctor)/dashboard')} />
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Users size={32} color={Colors.primary} />
                <Text style={styles.statNumber}>{patients.length}</Text>
                <Text style={styles.statLabel}>Patients</Text>
              </View>
            </Card>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Calendar size={32} color={Colors.secondary} />
                <Text style={styles.statNumber}>{totalConsultations}</Text>
                <Text style={styles.statLabel}>Consultations</Text>
              </View>
            </Card>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  greeting: { fontSize: 16, color: Colors.gray },
  name: { fontSize: 24, fontWeight: '700', color: Colors.text },
  content: { flex: 1 },
  contentContainer: { padding: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1 },
  statContent: { alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: '700', color: Colors.text, marginTop: 12 },
  statLabel: { fontSize: 14, color: Colors.gray, marginTop: 4 },
  loadingIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  errorText: { fontSize: 16, color: 'red', marginBottom: 12 },
});
