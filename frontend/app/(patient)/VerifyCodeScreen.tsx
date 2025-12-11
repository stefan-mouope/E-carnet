import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyPatientCode } from '@/services/api';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ← Correct pour les dernières versions
  const id_patient = params.id_patient as string; // TypeScript

  const [codeUnique, setCodeUnique] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!codeUnique.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre code unique.');
      return;
    }

    setLoading(true);

    try {
      const data = await verifyPatientCode(id_patient, codeUnique);

      if (data.success) {
        Alert.alert('Succès', 'Code validé !', [
          { text: 'OK', onPress: () => router.replace('/(patient)/dashboard') },
        ]);
      } else {
        Alert.alert('Erreur', data.message || 'Code invalide.');
      }
    } catch (err: any) {
      console.error('Erreur verification code:', err);
      Alert.alert('Erreur', 'Impossible de vérifier le code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez votre code unique :</Text>
      <TextInput
        value={codeUnique}
        onChangeText={setCodeUnique}
        placeholder="Code unique"
        style={styles.input}
        autoCapitalize="characters"
      />
      <Button title={loading ? 'Vérification...' : 'Valider'} onPress={handleVerifyCode} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
});
