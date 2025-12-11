import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import { login } from '@/services/api'; // Importez la fonction de connexion
// import { fakeDoctorUser, fakePatientUser } from '@/mock/data'; // Suppression des données mockées

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [uniqueCode, setUniqueCode] = useState(''); // Suppression du code unique pour la connexion
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

  const handleLogin = async () => { // Rendre la fonction asynchrone
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true); // Commencer le chargement
    try {
      const response = await login(username, password, role);
      Alert.alert('Succès', response.message);
      if (role === 'doctor') {
        router.replace('/(doctor)/dashboard');
      } else {
        // Pour les patients, nous pourrions avoir besoin de stocker le uniqueCode pour getPatientMe
        // Cela devrait être géré après la connexion, en récupérant les données du patient
        router.replace('/(patient)/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la connexion.';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Connexion" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'patient' && styles.roleButtonActive]}
            onPress={() => setRole('patient')}
          >
            <Text style={[styles.roleText, role === 'patient' && styles.roleTextActive]}>
              Patient
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'doctor' && styles.roleButtonActive]}
            onPress={() => setRole('doctor')}
          >
            <Text style={[styles.roleText, role === 'doctor' && styles.roleTextActive]}>
              Docteur
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input
            label="Nom d'utilisateur"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Suppression du champ uniqueCode pour la connexion */}
          {/* {role === 'patient' && (
            <Input
              label="Code unique"
              placeholder="Entrez votre code unique"
              value={uniqueCode}
              onChangeText={setUniqueCode}
              autoCapitalize="characters"
            />
          )} */}

          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>Identifiants de test :</Text>
            {/* Les identifiants de test devraient venir du backend ou d'une configuration réelle */}
            <Text style={styles.hintText}>Pour le docteur: username: dr.lefebvre, password: doctor123</Text>
            <Text style={styles.hintText}>Pour le patient: username: marie.dubois, password: patient123</Text>
          </View>

          <Button title="Se connecter" onPress={handleLogin} disabled={loading} />
        </View>
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
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray,
  },
  roleTextActive: {
    color: Colors.white,
  },
  form: {
    width: '100%',
  },
  hintContainer: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  hintText: {
    fontSize: 11,
    color: Colors.gray,
  },
});
