import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { createPatient } from '@/services/api'; // Importer la fonction createPatient

export default function AddPatient() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [username, setUsername] = useState(''); // Nouvel état pour le nom d'utilisateur
  const [password, setPassword] = useState(''); // Nouvel état pour le mot de passe
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

  const generateUniqueCode = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `PAT-${year}-${random}`;
  };

  const handleSave = async () => {
    if (!name || !age || !weight || !height || !bloodType || !username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires, y compris le nom d\'utilisateur et le mot de passe.');
      return;
    }

    const uniqueCode = generateUniqueCode(); // Le code unique est généré ici

    setLoading(true); // Commencer le chargement
    try {
      const patientData = {
        nom: name,
        age: parseInt(age),
        poids: parseFloat(weight),
        taille: parseInt(height),
        groupe_sanguin: bloodType,
        antecedents: medicalHistory,
        code_unique: uniqueCode,
      };
      
      await createPatient(patientData, username, password);
      Alert.alert(
        'Patient créé',
        `Le patient a été créé avec succès!\n\nCode unique: ${uniqueCode}`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(doctor)/dashboard'),
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la création du patient.';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Ajouter un patient" onBack={() => router.back()} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <Input
            label="Nom complet *"
            placeholder="Jean Dupont"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Âge *"
            placeholder="30"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Informations de connexion</Text>
          <Input
            label="Nom d'utilisateur *"
            placeholder="j.dupont"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Input
            label="Mot de passe *"
            placeholder="Entrez un mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Informations physiques</Text>
          <Input
            label="Poids (kg) *"
            placeholder="70"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <Input
            label="Taille (cm) *"
            placeholder="175"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <Input
            label="Groupe sanguin *"
            placeholder="A+"
            value={bloodType}
            onChangeText={setBloodType}
            autoCapitalize="characters"
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Antécédents médicaux</Text>
          <Input
            label="Antécédents"
            placeholder="Allergies, maladies chroniques..."
            value={medicalHistory}
            onChangeText={setMedicalHistory}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </Card>

        <Button title="Créer le patient" onPress={handleSave} disabled={loading} />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
