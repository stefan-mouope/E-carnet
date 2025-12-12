import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { getDoctorIdFromToken } from '@/services/authService';
import { createConsultation } from '@/services/api';


export default function AddConsultation() {
  const router = useRouter();
  const { patientId, patientName } = useLocalSearchParams();

  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);



// add-consultation.tsx (modification du handleSave)

const handleSave = async () => {
  if (!patientId || !symptoms || !diagnosis || !treatment) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    return;
  }

  setLoading(true);
  try {
    const doctorId = await getDoctorIdFromToken();
    if (!doctorId) throw new Error('Docteur non identifié');

    const consultationData = {
      patient_id: patientId,
      symptomes: symptoms,
      diagnostic: diagnosis,
      traitement: treatment,
      ordonnance: prescription,
      notes,
    };

    const response = await createConsultation(consultationData);

    // LA CONSULTATION CRÉÉE DOIT ÊTRE RENVOYÉE PAR TON API
    const newConsultation = response.consultation || response.data;

    Alert.alert('Succès', 'Consultation enregistrée !', [
      {
        text: 'OK',
        onPress: () => {
          // ON RETOURNE EN PASSANT LA NOUVELLE CONSULTATION DANS LES PARAMS
          router.replace({
            pathname: '/(doctor)/patient-profile',
            params: {
              id: patientId as string,
              newConsultation: JSON.stringify(newConsultation), // <-- C'EST ÇA QUI MARCHE
            },
          });
        },
      },
    ]);
  } catch (error: any) {
    Alert.alert('Erreur', error.response?.data?.message || 'Échec de l’enregistrement');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Header title="Nouvelle consultation" onBack={() => router.back()} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Card>
          <Text style={styles.patientName}>Patient: {patientName}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Symptômes *</Text>
          <Input
            placeholder="Décrivez les symptômes du patient..."
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Diagnostic *</Text>
          <Input
            placeholder="Diagnostic établi..."
            value={diagnosis}
            onChangeText={setDiagnosis}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Traitement *</Text>
          <Input
            placeholder="Traitement recommandé..."
            value={treatment}
            onChangeText={setTreatment}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Ordonnance</Text>
          <Input
            placeholder="Médicaments prescrits..."
            value={prescription}
            onChangeText={setPrescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Notes additionnelles</Text>
          <Input
            placeholder="Notes pour le suivi..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </Card>

        <Button
          title="Enregistrer la consultation"
          onPress={handleSave}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1 },
  contentContainer: { padding: 24 },
  patientName: { fontSize: 18, fontWeight: '700', color: Colors.text },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
});
