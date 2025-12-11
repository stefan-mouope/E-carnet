import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Users, UserPlus, Calendar } from 'lucide-react-native';
import { getDoctorPatients, getConsultationsForPatient } from '@/services/api';

export type UserRole = 'patient' | 'doctor';

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

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  uniqueCode?: string;
  patientData?: Patient;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState('Dr. Nom du Docteur');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const patientsResponse = await getDoctorPatients();
        console.log('Patients trouvés:', patientsResponse.patients);

        // Normalisation des patients
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

        // Récupérer les consultations récentes
        let allConsultations: Consultation[] = [];
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
          allConsultations = [...allConsultations, ...normalizedConsults];
        }

        setRecentConsultations(
          allConsultations
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
        );
      } catch (err: any) {
        console.error('Failed to fetch doctor dashboard data:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement du tableau de bord.');
        Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    router.replace('/login');
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

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>Erreur</Text>
          <Button title="Déconnexion" onPress={handleLogout} variant="outline" />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Réessayer" onPress={() => router.replace('/(doctor)/dashboard')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.name}>{doctorName}</Text>
        </View>
        <Button title="Déconnexion" onPress={handleLogout} variant="outline" />
      </View>

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
              <Text style={styles.statNumber}>{recentConsultations.length}</Text>
              <Text style={styles.statLabel}>Consultations</Text>
            </View>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Actions rapides</Text>

        <Card onPress={() => router.push('/(doctor)/patients-list')}>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Users size={24} color={Colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Liste des patients</Text>
              <Text style={styles.actionSubtitle}>Voir tous les patients</Text>
            </View>
          </View>
        </Card>

        <Card onPress={() => router.push('/(doctor)/add-patient')}>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <UserPlus size={24} color={Colors.secondary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Ajouter un patient</Text>
              <Text style={styles.actionSubtitle}>Créer un nouveau dossier</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Consultations récentes</Text>
        {recentConsultations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune consultation récente</Text>
          </View>
        ) : (
          recentConsultations.map((c) => (
            <Card key={c.id}>
              <View style={styles.consultationItem}>
                <Text style={styles.consultationPatient}>{c.patientName}</Text>
                <Text style={styles.consultationDate}>{c.date}</Text>
                <Text style={styles.consultationDiagnosis} numberOfLines={1}>
                  {c.diagnosis}
                </Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text },
  actionSubtitle: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  consultationItem: { gap: 6, marginBottom: 12 },
  consultationPatient: { fontSize: 16, fontWeight: '600', color: Colors.text },
  consultationDate: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  consultationDiagnosis: { fontSize: 14, color: Colors.gray },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: Colors.gray },
  loadingIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  errorText: { fontSize: 16, color: 'red', marginBottom: 12 },
});
