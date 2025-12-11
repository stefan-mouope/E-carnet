import { useState, useEffect } from 'react'; // Importer useEffect
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'; // Importer ActivityIndicator
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { getPatientById, getConsultationsForPatient, updatePatient } from '@/services/api'; // Importer les fonctions API
import { Patient, Consultation } from '@/types'; // Importer les types
import { Calendar } from 'lucide-react-native';

export default function PatientProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [saving, setSaving] = useState(false); // État pour l'enregistrement des modifications

  useEffect(() => {
    if (!id) {
      setError('ID du patient manquant.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const patientResponse = await getPatientById(id as string);
        setPatient(patientResponse.patient);
        setName(patientResponse.patient.name);
        setAge(patientResponse.patient.age.toString());
        setWeight(patientResponse.patient.weight.toString());
        setHeight(patientResponse.patient.height.toString());
        setMedicalHistory(patientResponse.patient.medicalHistory);

        const consultationsResponse = await getConsultationsForPatient(id as string);
        setConsultations(consultationsResponse.consultations);
      } catch (err: any) {
        console.error("Failed to fetch patient data:", err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des données du patient.');
        Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement des données du patient.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!patient) return;
    setSaving(true); // Commencer l'enregistrement
    try {
      const updatedPatientData = {
        name,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseInt(height),
        medicalHistory,
      };
      const response = await updatePatient(patient.id, updatedPatientData);
      setPatient(response.patient);
      Alert.alert('Succès', 'Modifications enregistrées avec succès!');
      setIsEditing(false);
    } catch (err: any) {
      console.error("Failed to update patient data:", err);
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de l\'enregistrement des modifications.');
    } finally {
      setSaving(false); // Arrêter l'enregistrement
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Profil Patient" onBack={() => router.back()} />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={styles.container}>
        <Header title="Profil Patient" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Patient non trouvé'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profil Patient" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card>
          <View style={styles.profileHeader}>
            <View>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientCode}>{patient.uniqueCode}</Text>
            </View>
            <Badge text={patient.bloodType} variant="error" />
          </View>
        </Card>

        {isEditing ? (
          <>
            <Card>
              <Text style={styles.sectionTitle}>Modifier les informations</Text>
              <Input label="Nom complet" value={name} onChangeText={setName} />
              <Input
                label="Âge"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
              <Input
                label="Poids (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <Input
                label="Taille (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
              <Input
                label="Antécédents médicaux"
                value={medicalHistory}
                onChangeText={setMedicalHistory}
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />
            </Card>
            <View style={styles.buttonsRow}>
              <Button
                title="Annuler"
                onPress={() => {
                  setIsEditing(false);
                  // Réinitialiser les états locaux avec les données du patient actuel
                  setName(patient.name);
                  setAge(patient.age.toString());
                  setWeight(patient.weight.toString());
                  setHeight(patient.height.toString());
                  setMedicalHistory(patient.medicalHistory);
                }}
                variant="outline"
              />
              <View style={styles.buttonSpacer} />
              <Button title="Enregistrer" onPress={handleSave} disabled={saving} />
            </View>
          </>
        ) : (
          <>
            <Card>
              <Text style={styles.sectionTitle}>Informations physiques</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Âge:</Text>
                <Text style={styles.value}>{patient.age} ans</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Poids:</Text>
                <Text style={styles.value}>{patient.weight} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Taille:</Text>
                <Text style={styles.value}>{patient.height} cm</Text>
              </View>
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>Antécédents médicaux</Text>
              <Text style={styles.historyText}>{patient.medicalHistory}</Text>
            </Card>

            <Button title="Modifier les informations" onPress={() => setIsEditing(true)} />

            <Button
              title="Ajouter une consultation"
              onPress={() =>
                router.push({
                  pathname: '/(doctor)/add-consultation',
                  params: { patientId: patient.id, patientName: patient.name },
                })
              }
              variant="secondary"
            />
          </>
        )}

        <Card>
          <Text style={styles.sectionTitle}>
            Historique des consultations ({consultations.length})
          </Text>
          {consultations.length === 0 ? (
            <Text style={styles.emptyText}>Aucune consultation</Text>
          ) : (
            consultations.map((consultation) => (
              <View key={consultation.id} style={styles.consultationItem}>
                <View style={styles.consultationHeader}>
                  <Calendar size={16} color={Colors.primary} />
                  <Text style={styles.consultationDate}>{consultation.date}</Text>
                </View>
                <Text style={styles.consultationDiagnosis} numberOfLines={1}>
                  {consultation.diagnosis}
                </Text>
              </View>
            ))
          )}
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  patientCode: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  historyText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonSpacer: {
    width: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  consultationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  consultationDate: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  consultationDiagnosis: {
    fontSize: 14,
    color: Colors.text,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
