const patientService = require('../services/patientService');
const { updatePatientSchema } = require('../validators/patientValidator');
const PATIENT = require('../../patients/models/PATIENT');

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updatePatientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const patient = await patientService.updatePatient(id, req.body);
    res.status(200).json({ message: 'Patient updated successfully', patient });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getPatientMe = async (req, res) => {
  try {
    const { code_unique } = req.query;
    if (!code_unique) {
      return res.status(400).json({ message: 'code_unique is required' });
    }
    const patient = await patientService.getPatientByCodeUnique(code_unique);

    // Verify if the authenticated patient matches the requested code_unique
    if (req.user.role === 'PATIENT' && patient.id_user !== req.user.id_user) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.status(200).json({ message: 'Patient data retrieved successfully', patient });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);
    res.status(200).json({ message: 'Patient data retrieved successfully', patient });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    if (req.user.role !== 'DOCTEUR') {
      return res.status(403).json({ message: 'Access denied. Only doctors can view this resource.' });
    }
    // req.user.id_docteur is attached by the auth middleware
    console.log('ID docteur depuis JWT:', req.user.id_docteur);

    const patients = await patientService.getPatientsByDoctorId(req.user.id_docteur);
    console.log('Patients trouvés:', patients);
    res.status(200).json({ message: 'Patients retrieved successfully', patients });
  } catch (err) {
    console.error("Error in getDoctorPatients:", err.message);
    res.status(500).json({ message: err.message });
  }
};



const verifyPatientCode = async (req, res) => {
  try {
    const { id_patient, code_unique } = req.body;

    if (!id_patient || !code_unique) {
      return res.status(400).json({ message: 'ID patient et code unique requis.' });
    }

    const patient = await PATIENT.findOne({ where: { id_patient } });

    if (!patient) {
      return res.status(404).json({ message: 'Patient introuvable.' });
    }

    if (patient.code_unique !== code_unique) {
      return res.status(401).json({ message: 'Code unique incorrect.' });
    }

    res.status(200).json({
      message: 'Code validé avec succès',
      patient: {
        id_patient: patient.id_patient,
        nom: patient.nom,
        prenom: patient.prenom,
        consultations: patient.consultations, // ou fetch via autre table
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



const searchPatientByCode = async (req, res) => {
  try {
    const { code_unique } = req.body;

    if (!code_unique) {
      return res.status(400).json({ message: 'code_unique manquant' });
    }

    // Recherche globale (pas filtrée par docteur)
    const patient = await PATIENT.findOne({
      where: { code_unique },
      attributes: ['id_patient', 'nom', 'age', 'poids', 'taille', 'groupe_sanguin', 'antecedents', 'code_unique', 'createdAt'],  // Champs utiles pour le frontend
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé avec ce code' });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la recherche' });
  }
};





module.exports = {
  updatePatient,
  getPatientMe,
  getPatientById,
  getDoctorPatients,
  verifyPatientCode,
  searchPatientByCode
};

