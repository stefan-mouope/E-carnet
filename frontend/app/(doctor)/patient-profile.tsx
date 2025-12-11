// patient-profile.tsx → VERSION FINALE, 0 ERREUR TS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { Calendar } from 'lucide-react-native';
import { getPatientById, getConsultationsForPatient, updatePatient } from '@/services/api';
import { Patient, Consultation } from '@/types';

export default function PatientProfile() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; newConsultation?: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // États pour édition
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [antecedents, setAntecedents] = useState('');
  const [saving, setSaving] = useState(false);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Date invalide';
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const loadData = async () => {
    if (!params.id) {
      setError('ID du patient manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Charger le patient
      const patientRes = await getPatientById(params.id);
      const p: Patient = patientRes.patient;

      setPatient(p);
      setNom(p.nom);
      setAge(p.age?.toString() ?? '');
      setPoids(p.poids?.toString() ?? '');
      setTaille(p.taille?.toString() ?? '');
      setAntecedents(p.antecedents ?? '');

      // Charger les consultations
      const consRes = await getConsultationsForPatient(params.id);
      const list: Consultation[] = consRes.consultations || [];

      const formatted = list.map(c => ({
        ...c,
        date_consultation: formatDate(c.date_consultation),
      }));

      // Tri décroissant
      formatted.sort((a, b) =>
        new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime()
      );

      setConsultations(formatted);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur de chargement';
      setError(msg);
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  // Quand on revient après avoir ajouté une consultation
  useFocusEffect(
    useCallback(() => {
      if (params.newConsultation) {
        try {
          const nouvelle: Consultation = JSON.parse(params.newConsultation);

          const formatted: Consultation = {
            ...nouvelle,
            date_consultation: formatDate(nouvelle.date_consultation || nouvelle.createdAt || new Date().toISOString()),
          };

          setConsultations(prev => {
            if (prev.some(c => c.id_consultation === formatted.id_consultation)) return prev;
            return [formatted, ...prev];
          });
        } catch {
          loadData();
        }
      }
    }, [params.newConsultation])
  );

  const handleSave = async () => {
    if (!patient) return;

    setSaving(true);
    try {
      const updated = {
        nom,
        age: age ? Number(age) : null,
        poids: poids ? Number(poids) : null,
        taille: taille ? Number(taille) : null,
        antecedents,
      };

      await updatePatient(patient.id_patient.toString(), updated);

      setPatient(prev => prev ? { ...prev, ...updated } : null);
      Alert.alert('Succès', 'Modifications enregistrées !');
      setIsEditing(false);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Échec de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Profil Patient" onBack={() => router.back()} />
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  if (!patient) {
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* En-tête */}
        <Card>
          <View style={styles.profileHeader}>
            <View>
              <Text style={styles.patientName}>{patient.nom}</Text>
              <Text style={styles.patientCode}>{patient.code_unique}</Text>
            </View>
            {patient.groupe_sanguin && <Badge text={patient.groupe_sanguin} variant="error" />}
          </View>
        </Card>

        {isEditing ? (
          <>
            <Card>
              <Text style={styles.sectionTitle}>Modifier les informations</Text>
              <Input label="Nom complet" value={nom} onChangeText={setNom} />
              <Input label="Âge" value={age} onChangeText={setAge} keyboardType="numeric" />
              <Input label="Poids (kg)" value={poids} onChangeText={setPoids} keyboardType="numeric" />
              <Input label="Taille (cm)" value={taille} onChangeText={setTaille} keyboardType="numeric" />
              <Input
                label="Antécédents médicaux"
                value={antecedents}
                onChangeText={setAntecedents}
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />
            </Card>

            <View style={styles.buttonsRow}>
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => {
                  setIsEditing(false);
                  setNom(patient.nom);
                  setAge(patient.age?.toString() ?? '');
                  setPoids(patient.poids?.toString() ?? '');
                  setTaille(patient.taille?.toString() ?? '');
                  setAntecedents(patient.antecedents ?? '');
                }}
              />
              <View style={styles.buttonSpacer} />
              <Button
                title={saving ? 'Enregistrement...' : 'Enregistrer'}
                onPress={handleSave}
                disabled={saving}
              />
            </View>
          </>
        ) : (
          <>
            <Card>
              <Text style={styles.sectionTitle}>Informations physiques</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Âge :</Text>
                <Text style={styles.value}>{patient.age ?? '-'} ans</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Poids :</Text>
                <Text style={styles.value}>{patient.poids ?? '-'} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Taille :</Text>
                <Text style={styles.value}>{patient.taille ?? '-'} cm</Text>
              </View>
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>Antécédents médicaux</Text>
              <Text style={styles.historyText}>
                {patient.antecedents || 'Aucun antécédent renseigné'}
              </Text>
            </Card>

            <Button title="Modifier les informations" onPress={() => setIsEditing(true)} />

            <Button
              title="Ajouter une consultation"
              variant="secondary"
              onPress={() =>
                router.push({
                  pathname: '/(doctor)/add-consultation',
                  params: {
                    patientId: patient.id_patient.toString(),
                    patientName: patient.nom,
                  },
                })
              }
            />
          </>
        )}

       {/* Historique des consultations */}
        <Card>
          <Text style={styles.sectionTitle}>
            Historique des consultations ({consultations.length})
          </Text>

          {consultations.length === 0 ? (
            <Text style={styles.emptyText}>Aucune consultation enregistrée</Text>
          ) : (
            consultations.map((c, index) => (
              <View key={c.id_consultation} style={styles.consultationItem}>
                <View style={styles.consultationHeader}>
                  <Calendar size={16} color={Colors.primary} />
                  <Text style={styles.consultationNumber}>
                    Consultation #{consultations.length - index}
                  </Text>
                  <Text style={styles.consultationDate}> • {c.date_consultation}</Text>
                </View>

                <Button
                  title="Voir détails"
                  onPress={() =>
                    router.push({
                      pathname: "/(doctor)/consultation-details",
                      params: {
                        consultationId: c.id_consultation.toString(),
                        patientId: patient.id_patient.toString(),
                        patientName: patient.nom,
                      },
                    })
                  }
                />
              </View>
            ))
          )}
        </Card>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { padding: 24 },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 24, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  patientCode: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  label: { fontSize: 14, color: Colors.gray },
  value: { fontSize: 14, fontWeight: '600', color: Colors.text },
  historyText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  buttonsRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
  buttonSpacer: { width: 12 },
  emptyText: { fontSize: 14, color: Colors.gray, fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  consultationItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  consultationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  consultationNumber: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  consultationDate: { fontSize: 13, color: Colors.gray },
  consultationLabel: { fontSize: 12, color: Colors.gray, marginTop: 10, marginBottom: 4, fontWeight: '600' },
  consultationText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#ef4444' },
});