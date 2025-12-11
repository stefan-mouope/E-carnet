const consultationService = require('../services/consultationService');
const { createConsultationSchema } = require('../validators/consultationValidator');
const PATIENT = require('../../patients/models/PATIENT');

const createConsultation = async (req, res) => {
  try {
    const { error } = createConsultationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const docteur_id = req.user.id_docteur; // Assuming req.user contains id_docteur for authenticated doctor
    const consultation = await consultationService.createConsultation(req.body, docteur_id);
    res.status(201).json({ message: 'Consultation created successfully', consultation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getConsultationsForPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const patient = await PATIENT.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    if (req.user.role === 'PATIENT' && patient.id_user !== req.user.id_user) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const consultations = await consultationService.getConsultationsByPatientId(patient_id);
    res.status(200).json({ message: 'Consultations retrieved successfully', consultations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createConsultation,
  getConsultationsForPatient,
};



