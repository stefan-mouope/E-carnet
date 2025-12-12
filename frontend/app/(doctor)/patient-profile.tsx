// patient-profile.tsx → VERSION AMÉLIORÉE avec design moderne

import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { Calendar, User, Heart, Ruler, Weight, Edit3, Save, X, FileText, Clock, Eye } from 'lucide-react-native';
import { getPatientById, getConsultationsForPatient, updatePatient } from '@/services/api';
import { Patient, Consultation } from '@/types';

export default function PatientProfile() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    id: string; 
    newConsultation?: string;
    readOnly?: string; 
  }>();

  const isReadOnly = params.readOnly === 'true';

  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

      const patientRes = await getPatientById(params.id);
      const p: Patient = patientRes.patient;

      setPatient(p);
      setNom(p.nom);
      setAge(p.age?.toString() ?? '');
      setPoids(p.poids?.toString() ?? '');
      setTaille(p.taille?.toString() ?? '');
      setAntecedents(p.antecedents ?? '');

      const consRes = await getConsultationsForPatient(params.id);
      const list: Consultation[] = consRes.consultations || [];

      const formatted = list.map(c => ({
        ...c,
        date_consultation: formatDate(c.date_consultation),
      }));

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

  useFocusEffect(
    useCallback(() => {
      if (params.newConsultation && !isReadOnly) {
        try {
          const nouvelle: Consultation = JSON.parse(params.newConsultation as string);

          const formatted = {
            ...nouvelle,
            date_consultation: formatDate(
              nouvelle.date_consultation || nouvelle.createdAt || new Date().toISOString()
            ),
          };

          setConsultations(prev => {
            if (prev.some(c => c.id_consultation === formatted.id_consultation)) {
              return prev;
            }
            const updated = [formatted, ...prev];
            updated.sort((a, b) =>
              new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime()
            );
            return updated;
          });

          router.setParams({ newConsultation: undefined });
        } catch (e) {
          console.error('Erreur parsing newConsultation');
          loadData();
        }
      }
    }, [params.newConsultation, isReadOnly])
  );

  const handleSave = async () => {
    if (!patient || isReadOnly) return;

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
      Alert.alert('✅ Succès', 'Modifications enregistrées avec succès !');
      setIsEditing(false);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Échec de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (patient) {
      setNom(patient.nom);
      setAge(patient.age?.toString() ?? '');
      setPoids(patient.poids?.toString() ?? '');
      setTaille(patient.taille?.toString() ?? '');
      setAntecedents(patient.antecedents ?? '');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Profil Patient" onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement du dossier...</Text>
        </View>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Header title="Profil Patient" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Patient non trouvé'}</Text>
          <Button title="Retour" onPress={() => router.back()} variant="outline" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={isReadOnly ? 'Mon dossier médical' : 'Profil patient'} 
        onBack={() => router.back()} 
      />

      {isReadOnly && (
        <View style={styles.readOnlyBanner}>
          <Eye size={20} color="white" />
          <View style={styles.readOnlyTextContainer}>
            <Text style={styles.readOnlyText}>Consultation en lecture seule</Text>
            <Text style={styles.readOnlySubtext}>
              Vous ne pouvez pas modifier ces informations
            </Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* EN-TÊTE PATIENT */}
        <Card style={styles.headerCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={40} color={Colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.patientName}>{patient.nom}</Text>
              <View style={styles.codeContainer}>
                <Text style={styles.patientCode}>#{patient.code_unique}</Text>
              </View>
            </View>
            {patient.groupe_sanguin && (
              <Badge text={patient.groupe_sanguin} variant="error" />
            )}
          </View>
        </Card>

        {/* INFORMATIONS PHYSIQUES */}
        {isEditing && !isReadOnly ? (
          <Card style={styles.editCard}>
            <View style={styles.cardTitleRow}>
              <Edit3 size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Modifier les informations</Text>
            </View>
            
            <Input label="Nom complet" value={nom} onChangeText={setNom} />
            <Input 
              label="Âge" 
              value={age} 
              onChangeText={setAge} 
              keyboardType="numeric"
              placeholder="Ex: 45"
            />
            <Input 
              label="Poids (kg)" 
              value={poids} 
              onChangeText={setPoids} 
              keyboardType="numeric"
              placeholder="Ex: 75"
            />
            <Input 
              label="Taille (cm)" 
              value={taille} 
              onChangeText={setTaille} 
              keyboardType="numeric"
              placeholder="Ex: 175"
            />
            <Input
              label="Antécédents médicaux"
              value={antecedents}
              onChangeText={setAntecedents}
              multiline
              numberOfLines={4}
              style={styles.textArea}
              placeholder="Allergies, opérations, maladies chroniques..."
            />

            <View style={styles.editButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={cancelEdit}
                disabled={saving}
              >
                <X size={18} color={Colors.gray} />
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={saving}
              >
                <Save size={18} color="white" />
                <Text style={styles.saveButtonText}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <>
            <Card>
              <View style={styles.cardTitleRow}>
                <Heart size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Informations physiques</Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Calendar size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Âge</Text>
                  <Text style={styles.statValue}>{patient.age ?? '-'} ans</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Weight size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Poids</Text>
                  <Text style={styles.statValue}>{patient.poids ?? '-'} kg</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ruler size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Taille</Text>
                  <Text style={styles.statValue}>{patient.taille ?? '-'} cm</Text>
                </View>
              </View>
            </Card>

            <Card>
              <View style={styles.cardTitleRow}>
                <FileText size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Antécédents médicaux</Text>
              </View>
              <View style={styles.antecedentsContainer}>
                <Text style={styles.historyText}>
                  {patient.antecedents || 'Aucun antécédent renseigné'}
                </Text>
              </View>
            </Card>

            {!isReadOnly && (
              <View style={styles.actionButtons}>
                <Button 
                  title="Modifier les informations" 
                  onPress={() => setIsEditing(true)}
                  variant="outline"
                  style={styles.actionButton}
                />
                <Button
                  title="Nouvelle consultation"
                  onPress={() =>
                    router.push({
                      pathname: '/(doctor)/add-consultation',
                      params: {
                        patientId: patient.id_patient.toString(),
                        patientName: patient.nom,
                      },
                    })
                  }
                  style={styles.actionButton}
                />
              </View>
            )}
          </>
        )}

        {/* HISTORIQUE DES CONSULTATIONS */}
        <Card style={styles.consultationsCard}>
          <View style={styles.consultationsHeader}>
            <View style={styles.cardTitleRow}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Historique des consultations</Text>
            </View>
            <View style={styles.consultationsBadge}>
              <Text style={styles.consultationsBadgeText}>{consultations.length}</Text>
            </View>
          </View>

          {consultations.length === 0 ? (
            <View style={styles.emptyConsultations}>
              <FileText size={48} color={Colors.lightGray} />
              <Text style={styles.emptyText}>Aucune consultation enregistrée</Text>
            </View>
          ) : (
            consultations.map((c, index) => (
              <TouchableOpacity
                key={c.id_consultation}
                style={styles.consultationItem}
                onPress={() =>
                  router.push({
                    pathname: '/(doctor)/consultation-details',
                    params: {
                      consultationId: c.id_consultation.toString(),
                      patientId: patient.id_patient.toString(),
                      patientName: patient.nom,
                    },
                  })
                }
              >
                <View style={styles.consultationContent}>
                  <View style={styles.consultationIcon}>
                    <Calendar size={16} color={Colors.primary} />
                  </View>
                  <View style={styles.consultationDetails}>
                    <Text style={styles.consultationNumber}>
                      Consultation #{consultations.length - index}
                    </Text>
                    <Text style={styles.consultationDate}>{c.date_consultation}</Text>
                  </View>
                </View>
                <View style={styles.consultationArrow}>
                  <Text style={styles.arrowText}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.gray,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },

  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  readOnlyTextContainer: {
    flex: 1,
  },
  readOnlyText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  readOnlySubtext: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },

  headerCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  codeContainer: {
    alignSelf: 'flex-start',
  },
  patientCode: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },

  antecedentsContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 10,
  },
  historyText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },

  editCard: {
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.gray,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },

  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 0,
  },

  consultationsCard: {
    marginTop: 16,
  },
  consultationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  consultationsBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  consultationsBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyConsultations: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
  },

  consultationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: -16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  consultationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  consultationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultationDetails: {
    flex: 1,
  },
  consultationNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  consultationDate: {
    fontSize: 13,
    color: Colors.gray,
  },
  consultationArrow: {
    paddingLeft: 12,
  },
  arrowText: {
    fontSize: 24,
    color: Colors.gray,
    fontWeight: '300',
  },
});