import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'; // Importer ActivityIndicator
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { createConsultation } from '@/services/api'; // Importer la fonction createConsultation

export default function AddConsultation() {
  const router = useRouter();
  const { patientId, patientName } = useLocalSearchParams();

  // const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Le backend gérera la date
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

  const handleSave = async () => {
    if (!patientId || !symptoms || !diagnosis || !treatment) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (symptômes, diagnostic, traitement).');
      return;
    }

    setLoading(true); // Commencer le chargement
    try {
      const consultationData = {
        patientId: patientId as string,
        symptoms,
        diagnosis,
        treatment,
        prescription,
        notes,
      };
      await createConsultation(consultationData);
      Alert.alert(
        'Succès',
        'Consultation enregistrée avec succès!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error("Failed to create consultation:", error);
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement de la consultation.';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Nouvelle consultation" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card>
          <Text style={styles.patientName}>Patient: {patientName}</Text>
        </Card>

        {/* Suppression du champ date, géré par le backend */}
        {/* <Card>
          <Text style={styles.sectionTitle}>Informations de consultation</Text>
          <Input
            label="Date *"
            placeholder="AAAA-MM-JJ"
            value={date}
            onChangeText={setDate}
          />
        </Card> */}

        <Card>
          <Text style={styles.sectionTitle}>Symptômes *</Text>
          <Input
            label=""
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
            label=""
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
            label=""
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
            label=""
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
            label=""
            placeholder="Notes pour le suivi..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </Card>

        <Button title="Enregistrer la consultation" onPress={handleSave} disabled={loading} />
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
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
