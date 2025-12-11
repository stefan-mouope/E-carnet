const PATIENT = require('../models/PATIENT');
const AUTHUSER = require('../../accounts/models/AUTHUSER');
const DOCTEUR = require('../../accounts/models/DOCTEUR');
const CONSULTATION = require('../../consultations/models/CONSULTATION');

const updatePatient = async (id_patient, patientData) => {
  const patient = await PATIENT.findByPk(id_patient);
  if (!patient) {
    throw new Error('Patient not found');
  }
  await patient.update(patientData);
  return patient;
};

const getPatientById = async (id_patient) => {
  const patient = await PATIENT.findByPk(id_patient, {
    include: [{
      model: AUTHUSER,
      attributes: ['username']
    }]
  });
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient;
};

const getPatientByCodeUnique = async (code_unique) => {
  const patient = await PATIENT.findOne({ 
    where: { code_unique },
    include: [{
      model: AUTHUSER,
      attributes: ['username']
    }]
  });
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient;
};
const getPatientsByDoctorId = async (docteur_id) => {
  // Récupérer tous les patients dont doctorId correspond à l'id du docteur
  const patients = await PATIENT.findAll({
    where: {
      doctorId: docteur_id,
    },
    include: [
      {
        model: AUTHUSER,
        attributes: ['username'], // On récupère le username lié
      },
    ],
    attributes: {
      exclude: ['createdAt', 'updatedAt'], // Facultatif : supprimer timestamps si pas utiles
    },
  });

  return patients;
};


module.exports = {
  updatePatient,
  getPatientById,
  getPatientByCodeUnique,
  getPatientsByDoctorId,
};

