const CONSULTATION = require('../models/CONSULTATION');
const PATIENT = require('../../patients/models/PATIENT');
const DOCTEUR = require('../../accounts/models/DOCTEUR');

const createConsultation = async (consultationData, docteur_id) => {
  const patient = await PATIENT.findByPk(consultationData.patient_id);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const doctor = await DOCTEUR.findByPk(docteur_id);
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const consultation = await CONSULTATION.create({
    ...consultationData,
    docteur_id,
    date_consultation: new Date(),
  });
  return consultation;
};

const getConsultationsByPatientId = async (patient_id) => {
  const consultations = await CONSULTATION.findAll({
    where: { patient_id },
    include: [{ model: PATIENT, attributes: ['nom', 'code_unique'] }, { model: DOCTEUR, attributes: ['nom', 'specialite'] }],
  });
  return consultations;
};

module.exports = {
  createConsultation,
  getConsultationsByPatientId,
};



