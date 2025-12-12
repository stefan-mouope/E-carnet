// PatientsList.tsx → VERSION AMÉLIORÉE avec recherche optimisée

import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { getDoctorPatients, searchPatientByCode } from '@/services/api';
import { Patient } from '@/types';
import { Search, X, Filter } from 'lucide-react-native';

export default function PatientsList() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingCode, setSearchingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterBloodType, setFilterBloodType] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await getDoctorPatients();

        const mappedPatients = response.patients.map((p: any): Patient => ({
          id_patient: p.id_patient,
          id_user: p.id_user,
          nom: p.nom,
          prenom: p.prenom,
          code_unique: p.code_unique,
          age: p.age ?? null,
          poids: p.poids ?? null,
          taille: p.taille ?? null,
          groupe_sanguin: p.groupe_sanguin ?? null,
          antecedents: p.antecedents ?? null,
          doctorId: p.doctorId,
        }));

        setPatients(mappedPatients);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Erreur lors du chargement des patients.';
        setError(msg);
        Alert.alert('Erreur', msg);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Détection automatique du type de recherche
  const isCodeSearch = useMemo(() => {
    const query = searchQuery.trim().toUpperCase();
    // Format du code unique: PAT-YYYY-XXX (ex: PAT-2025-410)
    // On détecte si ça ressemble à ce format ou si c'est au moins 4 caractères alphanumériques avec tirets
    const codePattern = /^PAT-\d{4}-\d+$/i;
    const partialCodePattern = /^[A-Z0-9-]+$/;
    
    return query.length >= 4 && (codePattern.test(query) || partialCodePattern.test(query));
  }, [searchQuery]);

  // Filtrage intelligent des patients (pour la recherche locale)
  const filteredPatients = useMemo(() => {
    // Si c'est une recherche par code et qu'on a cliqué sur chercher, on ne filtre pas localement
    if (isCodeSearch && searchingCode) {
      return patients;
    }

    let results = patients;

    // Filtre par recherche locale (nom/prénom ou code dans la liste actuelle)
    if (searchQuery.trim() && !isCodeSearch) {
      const query = searchQuery.toLowerCase();
      results = results.filter((patient) => {
        // Vérification de sécurité pour éviter les erreurs
        const prenom = patient.prenom?.toLowerCase() || '';
        const nom = patient.nom?.toLowerCase() || '';
        const fullName = `${prenom} ${nom}`;
        const code = patient.code_unique?.toLowerCase() || '';
        
        return (
          fullName.includes(query) ||
          nom.includes(query) ||
          prenom.includes(query) ||
          code.includes(query)
        );
      });
    }

    // Filtre par groupe sanguin
    if (filterBloodType) {
      results = results.filter((p) => p.groupe_sanguin === filterBloodType);
    }

    return results;
  }, [patients, searchQuery, filterBloodType, isCodeSearch, searchingCode]);

  // Liste unique des groupes sanguins
  const bloodTypes = useMemo(() => {
    const types = new Set(patients.map((p) => p.groupe_sanguin).filter(Boolean));
    return Array.from(types).sort();
  }, [patients]);

  const handleSearchByCode = async () => {
    const code = searchQuery.trim().toUpperCase();
    
    if (!code) {
      Alert.alert('Attention', 'Veuillez entrer un code unique');
      return;
    }

    if (code.length < 8) {
      Alert.alert('Code incomplet', 'Le code unique doit être au format PAT-YYYY-XXX (ex: PAT-2025-410)');
      return;
    }

    // Validation du format PAT-YYYY-XXX
    const codePattern = /^PAT-\d{4}-\d+$/i;
    if (!codePattern.test(code)) {
      Alert.alert(
        'Format invalide', 
        'Le code doit être au format PAT-YYYY-XXX\nExemple: PAT-2025-410'
      );
      return;
    }

    setSearchingCode(true);
    try {
      // Appel POST à l'API pour chercher dans toute la base de données
      const { patient } = await searchPatientByCode(code);

      // Redirection vers le profil du patient trouvé
      router.push({
        pathname: '/(doctor)/patient-profile',
        params: { id: String(patient.id_patient) },
      });

      // Réinitialisation de la recherche après succès
      setSearchQuery('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Aucun patient trouvé avec ce code';
      Alert.alert(
        'Patient introuvable', 
        `Le code "${code}" ne correspond à aucun patient dans la base de données.`
      );
    } finally {
      setSearchingCode(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setFilterBloodType(null);
  };

  return (
    <View style={styles.container}>
      <Header title="Mes patients" onBack={() => router.back()} />

      {/* BARRE DE RECHERCHE AMÉLIORÉE */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={Colors.gray} />
          <TextInput
            placeholder="Nom, prénom ou code (PAT-2025-XXX)..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCapitalize="characters"
            placeholderTextColor={Colors.gray}
          />
          
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.gray} />
            </TouchableOpacity>
          )}

          {isCodeSearch && searchQuery.length >= 8 && (
            <TouchableOpacity 
              onPress={handleSearchByCode}
              disabled={searchingCode}
              style={[styles.searchButton, searchingCode && styles.searchButtonDisabled]}
            >
              <Text style={styles.searchButtonText}>
                {searchingCode ? '...' : 'Chercher'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Indication du type de recherche */}
        {searchQuery.length > 0 && (
          <View style={styles.searchTypeIndicator}>
            {isCodeSearch ? (
              <>
                <Text style={styles.searchTypeText}>
                  🔍 <Text style={styles.boldText}>Recherche par code unique (PAT-2025-XXX)</Text>
                </Text>
                <Text style={styles.searchTypeSubtext}>
                  {searchQuery.length >= 8 
                    ? "Cliquez sur 'Chercher' pour rechercher dans toute la base" 
                    : "Continuez à taper le code complet..."}
                </Text>
              </>
            ) : (
              <Text style={styles.searchTypeText}>
                👤 Recherche par <Text style={styles.boldText}>nom/prénom</Text> (filtrage local)
              </Text>
            )}
          </View>
        )}

        {/* FILTRES PAR GROUPE SANGUIN */}
        {bloodTypes.length > 0 && (
          <View style={styles.filtersContainer}>
            <View style={styles.filtersHeader}>
              <View style={styles.filtersTitleRow}>
                <Filter size={16} color={Colors.gray} />
                <Text style={styles.filtersTitle}>Groupe sanguin</Text>
              </View>
              {filterBloodType && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text style={styles.clearFiltersText}>Effacer</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersList}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFilterBloodType(filterBloodType === type ? null : type)}
                  style={[
                    styles.filterChip,
                    filterBloodType === type && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterBloodType === type && styles.filterChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Compteur de résultats */}
        {!loading && (
          <Text style={styles.resultsCount}>
            {filteredPatients.length} patient{filteredPatients.length > 1 ? 's' : ''} 
            {searchQuery || filterBloodType ? ' trouvé(s)' : ''}
          </Text>
        )}
      </View>

      {/* LISTE DES PATIENTS */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : error ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : filteredPatients.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Text style={styles.emptyText}>
              {searchQuery || filterBloodType
                ? 'Essayez avec d\'autres critères de recherche'
                : 'Aucun patient enregistré'}
            </Text>
            {(searchQuery || filterBloodType) && (
              <Button
                title="Réinitialiser les filtres"
                onPress={() => {
                  clearSearch();
                  clearFilters();
                }}
                variant="secondary"
                style={styles.resetButton}
              />
            )}
          </View>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id_patient}
              onPress={() =>
                router.push({
                  pathname: '/(doctor)/patient-profile',
                  params: { id: String(patient.id_patient) },
                })
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.nameContainer}>
                  <Text style={styles.patientName}>
                    {patient.prenom} {patient.nom}
                  </Text>
                  <Text style={styles.code}>#{patient.code_unique}</Text>
                </View>
                {patient.groupe_sanguin && (
                  <Badge text={patient.groupe_sanguin} variant="error" />
                )}
              </View>
              <View style={styles.infoRow}>
                {patient.age && (
                  <Text style={styles.info}>🎂 {patient.age} ans</Text>
                )}
                {patient.poids && (
                  <Text style={styles.info}>⚖️ {patient.poids} kg</Text>
                )}
                {patient.taille && (
                  <Text style={styles.info}>📏 {patient.taille} cm</Text>
                )}
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
  
  searchContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  
  searchInput: { 
    flex: 1, 
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 36,
  },
  
  clearButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginLeft: 4,
  },
  
  searchButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginLeft: 6,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonDisabled: {
    opacity: 0.5,
  },

  searchButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  
  searchTypeIndicator: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  searchTypeText: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 4,
  },

  searchTypeSubtext: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  
  boldText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  
  filtersContainer: {
    marginTop: 16,
  },
  
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  filtersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  
  clearFiltersText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  
  filtersList: {
    flexDirection: 'row',
  },
  
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: 8,
  },
  
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
  },
  
  filterChipTextActive: {
    color: Colors.white,
  },
  
  resultsCount: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
  },
  
  contentContainer: { 
    padding: 20,
    paddingBottom: 40,
  },
  
  loader: { marginTop: 60 },
  
  empty: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  
  emptyText: { 
    fontSize: 15, 
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  resetButton: {
    marginTop: 20,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  
  nameContainer: {
    flex: 1,
  },
  
  patientName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: Colors.text,
    marginBottom: 4,
  },
  
  code: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: Colors.primary,
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  info: { 
    fontSize: 14, 
    color: Colors.gray,
  },
});