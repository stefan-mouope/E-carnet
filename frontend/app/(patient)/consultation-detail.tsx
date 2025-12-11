import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { getConsultationsForPatient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConsultationDetailPatient() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const patientId = await AsyncStorage.getItem('currentPatientId');
        if (!patientId) return router.replace('/(patient)/VerifyCodeScreen');

        const response = await getConsultationsForPatient(patientId);
        const all = response.consultations || response || [];

        const found = all.find((c: any) => 
          String(c.id_consultation || c.id) === String(id)
        );

        if (found) {
          setConsultation(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" color={Colors.primary} />;
  if (!consultation) return <Text style={{ textAlign: 'center', marginTop: 50, color: Colors.gray }}>
    Consultation non trouvée
  </Text>;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Détail de la consultation" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.date}>Le {formatDate(consultation.date_consultation || consultation.date)}</Text>
          <Text style={styles.doctor}>Par Dr {consultation.doctorName || 'Médecin'}</Text>
        </Card>

        {consultation.symptomes && (
          <Card>
            <Text style={styles.title}>Symptômes</Text>
            <Text style={styles.text}>{consultation.symptomes}</Text>
          </Card>
        )}

        {consultation.diagnostic && (
          <Card>
            <Text style={styles.title}>Diagnostic</Text>
            <Text style={styles.text}>{consultation.diagnostic}</Text>
          </Card>
        )}

        {consultation.traitement && (
          <Card>
            <Text style={styles.title}>Traitement recommandé</Text>
            <Text style={styles.text}>{consultation.traitement}</Text>
          </Card>
        )}

        {consultation.ordonnance && (
          <Card>
            <Text style={styles.title}>Ordonnance</Text>
            <Text style={styles.text}>{consultation.ordonnance}</Text>
          </Card>
        )}

        {consultation.notes && (
          <Card>
            <Text style={styles.title}>Notes du médecin</Text>
            <Text style={styles.text}>{consultation.notes}</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  date: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  doctor: { fontSize: 14, color: Colors.gray },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: Colors.text },
  text: { fontSize: 15, color: Colors.text, lineHeight: 22 },
});