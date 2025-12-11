export type UserRole = 'patient' | 'doctor';

export interface Patient {
  id_patient: number;
  id_user: number;
  nom: string;
  prenom?: string;
  code_unique: string;
  age?: number | null;
  poids?: number | null;
  taille?: number | null;
  groupe_sanguin?: string | null;
  antecedents?: string | null;
  doctorId?: number;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  uniqueCode?: string;
  patientData?: Patient;
}
