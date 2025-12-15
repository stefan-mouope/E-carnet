import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Patient } from '@/types';

const getBaseUrl = () => {
  // Si tu as défini une variable d'environnement (recommandé)
  // if (process.env.EXPO_PUBLIC_API_URL) {
  //   return process.env.EXPO_PUBLIC_API_URL;
  

  // Téléphone physique Android OU iOS → il faut l'IP de ta machine
  return 'https://backend-topitoh-s-2.onrender.com/api'; // ← Remplace par TON IP locale
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void; config: any; }[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject, config: originalRequest });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Pas de refresh token, déconnexion
        await logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/refresh-token`, { refreshToken }); // Endpoint à créer dans le backend si non existant
        const { access_token, refresh_token } = response.data;

        await AsyncStorage.setItem('accessToken', access_token);
        await AsyncStorage.setItem('refreshToken', refresh_token);

        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        processQueue(null, access_token);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string, role: 'doctor' | 'patient') => {
  const endpoint = role === 'doctor' ? '/accounts/login_doctor' : '/accounts/login_patient';
  const response = await api.post(endpoint, { username, password });
  const { access_token, refresh_token } = response.data;

  await AsyncStorage.multiSet([
    ['accessToken', access_token],
    ['refreshToken', refresh_token || ''],
    ['userRole', role],
  ]);

  // BONUS : on décode immédiatement pour stocker l'ID tout de suite
  if (role === 'doctor') {
    try {
      const base64Url = access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      if (payload.id_docteur) {
        await AsyncStorage.setItem('doctorId', String(payload.id_docteur));
      }
    } catch (e) {
      console.warn('Impossible de décoder le token au login');
    }
  }

  return response.data;
};

export const getUserRole = async (): Promise<'doctor' | 'patient' | null> => {
  const role = await AsyncStorage.getItem('userRole');
  return role as 'doctor' | 'patient' | null;
};




export const registerDoctor = async (nom: string, specialite: string, username: string, password: string) => {
  const response = await api.post('/accounts/register_doctor', { nom, specialite, username, password });
  return response.data;
};

export const createPatient = async (patientData: any, username: string, password: string) => {
  const user = await getUserFromToken();

  if (!user || user.role !== 'DOCTEUR') {
    throw new Error('Vous devez être connecté en tant que médecin pour créer un patient.');
  }

  const payload = {
    ...patientData,
    username,
    password,
  };

  console.log('Payload envoyé au backend →', payload); // tu verras doctorId: "1"

  const response = await api.post('/accounts/create_patient', payload);
  return response.data;
};


export const getDoctorPatients = async (): Promise<{ patients: Patient[] }> => {
  try {
    const response = await api.get('/patients/doctor/me');
    console.log('RAW RESPONSE from /patients/doctor/me:', response.data);

    // NORMALISATION FORCÉE – on accepte TOUTES les formes possibles
    let patients: Patient[] = [];

    if (Array.isArray(response.data)) {
      patients = response.data;
    } else if (response.data?.patients && Array.isArray(response.data.patients)) {
      patients = response.data.patients;
    } else if (response.data?.data?.patients) {
      patients = response.data.data.patients;
    }

    console.log('Patients normalisés →', patients.length, 'patients trouvés');
    return { patients };
  } catch (err: any) {
    console.error('ERREUR getDoctorPatients:', err.response?.data || err);
    throw err;
  }
};


export const getUserFromToken = async (): Promise<{ id: string; role: string; name: string } | null> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return null;

    const payload = parseJwt(token);

    console.log('Token décodé :', payload); // déjà présent → super utile

    return {
      id: payload.id_docteur?.toString(),  // CHANGEMENT ICI : id_docteur
      role: payload.role,
      name: payload.nom,
    };
  } catch (error) {
    console.error('Erreur décodage token:', error);
    return null;
  }
};

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}



export const getPatientById = async (id: string) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const getPatientMe = async (uniqueCode: string) => {
  const response = await api.get(`/patients/me?code_unique=${uniqueCode}`);
  return response.data;
};

export const updatePatient = async (id: string, patientData: any) => {
  const response = await api.put(`/patients/${id}/update`, patientData);
  return response.data;
};



export const verifyPatientCode = async (id_patient: string, code_unique: string) => {
  try {
    const response = await api.post('/patients/verify-code', { id_patient, code_unique });
    return response.data; // renvoie le patient + consultations si ok
  } catch (err: any) {
    console.error('Erreur verifyPatientCode:', err.response?.data || err);
    throw new Error(err.response?.data?.message || 'Impossible de vérifier le code unique');
  }
};


export const createConsultation = async (consultationData: any) => {
  const response = await api.post('/consultations/create', consultationData);
  return response.data;
};

export const getConsultationsForPatient = async (patientId: string) => {
  const response = await api.get(`/consultations/${patientId}/list`);
  return response.data;
};


// api.ts

// api.ts
export const searchPatientByCode = async (code_unique: string) => {
  try {
    const response = await api.post('/patients/search-by-code', { code_unique });

    const p = response.data.patient;

    // On retourne exactement le même format que les autres endpoints
    // → ton frontend sait déjà gérer id_patient, nom, code_unique, etc.
    const patient: Patient = {
      id_patient: p.id_patient,
      id_user: p.id_user || 0,
      nom: p.nom,
      prenom: p.prenom,
      code_unique: p.code_unique,
      age: p.age ?? null,
      poids: p.poids ?? null,
      taille: p.taille ?? null,
      groupe_sanguin: p.groupe_sanguin ?? null,
      antecedents: p.antecedents ?? null,
      doctorId: p.doctorId,
    };

    return { patient };
  } catch (err: any) {
    console.error('Erreur searchPatientByCode:', err.response?.data || err);
    throw err;
  }
};



export const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  // Rediriger vers l'écran de connexion
  router.replace('/login');
};

export default api;
