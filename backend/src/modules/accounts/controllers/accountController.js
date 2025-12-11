const accountService = require('../services/accountService');
const { registerDoctorSchema, loginSchema, createPatientSchema } = require('../validators/accountValidator');

/**
 * Enregistrement d'un docteur
 */
const registerDoctor = async (req, res) => {
  try {
    const { error } = registerDoctorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { nom, specialite, username, password } = req.body;
    const doctor = await accountService.registerDoctor(nom, specialite, username, password);

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: {
        id_docteur: doctor.id_docteur,
        nom: doctor.nom,
        specialite: doctor.specialite,
        username: doctor.username
      }
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    res.status(500).json({ message: err.message });
  }
};

/**
 * Connexion d'un docteur
 */
const loginDoctor = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;
    const { authUser, accessToken, refreshToken } = await accountService.loginUser(username, password, 'DOCTEUR');

    res.status(200).json({
      message: 'Doctor logged in successfully',
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

/**
 * Connexion d'un patient
 */
const loginPatient = async (req, res) => {
  try {
    // Validation du body
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    // On récupère authUser, tokens et patient directement depuis le service
    const { authUser, accessToken, refreshToken, patient } = await accountService.loginUser(username, password, 'PATIENT');

    if (!patient) {
      // Cas improbable si le patient n'existe pas malgré le login réussi
      return res.status(404).json({ message: 'Profil patient introuvable.' });
    }

    res.status(200).json({
      message: 'Patient logged in successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
      id_patient: patient.id_patient,
      code_unique: patient.code_unique
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};


/**
 * Création d'un patient (lié automatiquement au docteur connecté)
 */
const createPatient = async (req, res) => {
  try {
    const { error } = createPatientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password, ...patientData } = req.body;

    // LIGNE CLÉ : on récupère le docteur connecté depuis le middleware auth
    const doctorId = req.user.id_docteur;

    const patientWithDoctor = {
      ...patientData,
      doctorId, // association automatique avec le docteur
    };

    const { patient, authUser } = await accountService.createPatient(
      patientWithDoctor,
      username,
      password
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patient: {
        id_patient: patient.id_patient,
        nom: patient.nom,
        prenom: patient.prenom,
        code_unique: patient.code_unique,
      },
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username or unique code already exists.' });
    }
    console.error('Erreur création patient:', err);
    res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  loginPatient,
  createPatient,
};
