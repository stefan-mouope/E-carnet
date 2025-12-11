import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { Colors } from "@/constants/Colors";
import { getConsultationsForPatient } from "@/services/api";
import { Consultation } from "@/types";

export default function ConsultationDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ consultationId: string; patientName: string }>();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

const loadConsultation = async () => {
  if (!params.patientId || !params.consultationId) {
    Alert.alert("Erreur", "ID manquant.");
    return;
  }

  try {
    setLoading(true);

    // Récupérer TOUTES les consultations du patient
    const res = await getConsultationsForPatient(params.patientId);

    // res.consultations vient du backend
    const list = res.consultations || [];

    // Trouver celle qui correspond à l'ID de la consultation
    const found = list.find(
      (c: any) => String(c.id_consultation) === String(params.consultationId)
    );

    if (!found) {
      Alert.alert("Erreur", "Consultation introuvable.");
      return;
    }

    setConsultation(found);

  } catch (e: any) {
    Alert.alert(
      "Erreur",
      e.response?.data?.message || "Impossible de charger la consultation."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadConsultation();
  }, [params.consultationId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Détails consultation" onBack={() => router.back()} />
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  if (!consultation) {
    return (
      <View style={styles.container}>
        <Header title="Détails consultation" onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.error}>Consultation introuvable.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Consultation • ${params.patientName}`}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.title}>Date</Text>
          <Text style={styles.text}>{consultation.date_consultation}</Text>

          <Text style={styles.title}>Diagnostic</Text>
          <Text style={styles.text}>{consultation.diagnostic || "Non renseigné"}</Text>

          <Text style={styles.title}>Symptômes</Text>
          <Text style={styles.text}>{consultation.symptomes || "Non renseigné"}</Text>

          <Text style={styles.title}>Traitement</Text>
          <Text style={styles.text}>{consultation.traitement || "Non renseigné"}</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
    color: Colors.primary,
  },
  text: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  error: { fontSize: 16, color: "red" },
});
