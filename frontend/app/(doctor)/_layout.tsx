import { Stack } from 'expo-router';

export default function DoctorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="patients-list" />
      <Stack.Screen name="patient-profile" />
      <Stack.Screen name="add-patient" />
      <Stack.Screen name="add-consultation" />
    </Stack>
  );
}
