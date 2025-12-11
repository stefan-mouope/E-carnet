import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { getDoctorPatients } from '@/services/api';
import { Patient } from '@/types';
import { Search } from 'lucide-react-native';

export default function PatientsList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await getDoctorPatients();
  
        // Map les champs pour correspondre à ce que le frontend attend
        const mappedPatients = response.patients.map((p: any) => ({
          id: p.id_patient,
          name: p.nom,
          age: p.age,
          weight: p.poids,
          height: p.taille,
          bloodType: p.groupe_sanguin,
          uniqueCode: p.code_unique,
        }));
  
        setPatients(mappedPatients);
      } catch (err: any) {
        console.error("Failed to fetch patients:", err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des patients.');
        Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du chargement des patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);
  
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Liste des patients" onBack={() => router.back()} />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={20} color={Colors.gray} />
          <Input
            label=""
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : filteredPatients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun patient trouvé</Text>
          </View>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              onPress={() =>
                router.push({
                  pathname: '/(doctor)/patient-profile',
                  params: { id: patient.id },
                })
              }
            >
              <View style={styles.patientHeader}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Badge text={patient.bloodType} variant="error" />
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.infoText}>
                  {patient.age} ans • {patient.weight} kg • {patient.height} cm
                </Text>
              </View>
              <Text style={styles.patientCode}>{patient.uniqueCode}</Text>
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
  searchContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
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
    marginTop: 50,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  patientInfo: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray,
  },
  patientCode: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
});
