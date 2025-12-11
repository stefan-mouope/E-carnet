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

// types.ts
export interface Consultation {
  id_consultation: number;
  date_consultation: string;
  diagnostic: string;
  symptomes: string;
  traitement: string;
  ordonnance?: string;
  notes?: string;
  patient_id: number;
  docteur_id: number;
  DOCTEUR?: {
    nom: string;
    specialite?: string;
  };
  PATIENT?: {
    nom: string;
    code_unique: string;
  };
  createdAt?: string;
  updatedAt?: string;
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
