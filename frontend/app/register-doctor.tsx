import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';
import { registerDoctor } from '@/services/api'; // Importez la fonction registerDoctor

export default function RegisterDoctorScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

  const handleRegister = async () => { // Rendre la fonction asynchrone
    if (!name || !username || !password || !confirmPassword || !specialty) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true); // Commencer le chargement
    try {
      await registerDoctor(name, specialty, username, password);
      Alert.alert(
        'Succès',
        'Compte créé avec succès !',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Créer un compte Docteur" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Input
          label="Nom complet"
          placeholder="Dr. Jean Dupont"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Spécialité"
          placeholder="Médecine générale"
          value={specialty}
          onChangeText={setSpecialty}
        />
        <Input
          label="Nom d'utilisateur"
          placeholder="dr.dupont"
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
        <Input
          label="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button title="Créer le compte" onPress={handleRegister} disabled={loading} />
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
});
