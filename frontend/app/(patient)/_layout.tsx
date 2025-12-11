import { Stack } from 'expo-router';

export default function PatientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="dossier" />
      <Stack.Screen name="consultations" />
      <Stack.Screen name="consultation-detail" />
    </Stack>
  );
}
