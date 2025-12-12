import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { Colors } from "@/constants/Colors";
import { getConsultationsForPatient } from "@/services/api";
import { Consultation } from "@/types";
import { Calendar, Stethoscope, Activity, Pill, FileText, AlertCircle } from "lucide-react-native";

export default function ConsultationDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    consultationId: string; 
    patientName: string;
    patientId: string;
  }>();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const loadConsultation = async () => {
    if (!params.patientId || !params.consultationId) {
      Alert.alert("Erreur", "ID manquant.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Récupérer TOUTES les consultations du patient
      const res = await getConsultationsForPatient(params.patientId);
      const list = res.consultations || [];

      // Trouver celle qui correspond à l'ID de la consultation
      const found = list.find(
        (c: any) => String(c.id_consultation) === String(params.consultationId)
      );

      if (!found) {
        Alert.alert("Erreur", "Consultation introuvable.");
        setLoading(false);
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement de la consultation...</Text>
        </View>
      </View>
    );
  }

  if (!consultation) {
    return (
      <View style={styles.container}>
        <Header title="Détails consultation" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <AlertCircle size={64} color="#ef4444" />
          <Text style={styles.errorTitle}>Consultation introuvable</Text>
          <Text style={styles.errorText}>
            Cette consultation n'existe pas ou a été supprimée
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Détails de la consultation"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* EN-TÊTE AVEC PATIENT */}
        <Card style={styles.headerCard}>
          <View style={styles.patientHeader}>
            <View style={styles.patientIconContainer}>
              <FileText size={24} color={Colors.primary} />
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientLabel}>Patient</Text>
              <Text style={styles.patientName}>{params.patientName}</Text>
            </View>
          </View>
        </Card>

        {/* DATE DE LA CONSULTATION */}
        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Calendar size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Date de consultation</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {formatDate(consultation.date_consultation)}
            </Text>
          </View>
        </Card>

        {/* DIAGNOSTIC */}
        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Stethoscope size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Diagnostic</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              {consultation.diagnostic || "Aucun diagnostic renseigné"}
            </Text>
          </View>
        </Card>

        {/* SYMPTÔMES */}
        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Activity size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Symptômes observés</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              {consultation.symptomes || "Aucun symptôme renseigné"}
            </Text>
          </View>
        </Card>

        {/* TRAITEMENT */}
        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Pill size={20} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Traitement prescrit</Text>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              {consultation.traitement || "Aucun traitement prescrit"}
            </Text>
          </View>
        </Card>

        {/* INFO SUPPLÉMENTAIRE */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Cette consultation est enregistrée dans le dossier médical du patient
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
  },
  
  content: { 
    padding: 20,
    paddingBottom: 40,
  },

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
    gap: 16,
  },
  
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'center',
  },
  
  errorText: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },

  headerCard: {
    marginBottom: 16,
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },

  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  patientIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  patientInfo: {
    flex: 1,
  },

  patientLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },

  dateContainer: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },

  dateText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  contentBox: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 10,
    minHeight: 60,
  },

  contentText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },

  infoBox: {
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    marginTop: 8,
  },

  infoText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 20,
  },
});