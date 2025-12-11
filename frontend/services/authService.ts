import AsyncStorage from '@react-native-async-storage/async-storage';

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

export const getDoctorIdFromToken = async (): Promise<number | null> => {
  try {
    // On cherche d'abord dans AsyncStorage (on va aussi le stocker au login)
    const savedId = await AsyncStorage.getItem('doctorId');
    if (savedId) return Number(savedId);

    // Sinon on lit le vrai token (accessToken, pas "token" !)
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.warn('Aucun accessToken trouvé');
      return null;
    }

    const payload = parseJwt(token);
    console.log('Token décodé dans getDoctorIdFromToken →', payload);

    const doctorId = payload.id_docteur;

    if (!doctorId) {
      console.warn('id_docteur non trouvé dans le token');
      return null;
    }

    // On le sauvegarde pour les prochaines fois (plus rapide)
    await AsyncStorage.setItem('doctorId', String(doctorId));

    return Number(doctorId);
  } catch (error) {
    console.error('Erreur getDoctorIdFromToken :', error);
    return null;
  }
}