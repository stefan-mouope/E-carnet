const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const config = require('../../../config');
const AUTHUSER = require('../models/AUTHUSER');
const DOCTEUR = require('../models/DOCTEUR');
const PATIENT = require('../../patients/models/PATIENT');

/**
 * Génère un code unique pour chaque patient
 */
const generateUniqueCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const length = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // Length between 6 and 10
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Hash un mot de passe avec bcrypt
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compare un mot de passe avec son hash
 */
const comparePassword = async (candidatePassword, hash) => {
  return bcrypt.compare(candidatePassword, hash);
};

/**
 * Génère des tokens JWT pour un utilisateur
 */
const generateAuthTokens = (user) => {
  const accessToken = jwt.sign(
    { id_user: user.id_user, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtAccessExpires }
  );
  const refreshToken = jwt.sign(
    { id_user: user.id_user, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtRefreshExpires }
  );
  return { accessToken, refreshToken };
};

/**
 * Enregistre un docteur
 */
const registerDoctor = async (nom, specialite, username, password) => {
  const hashedPassword = await hashPassword(password);
  const authUser = await AUTHUSER.create({
    username,
    password: hashedPassword,
    role: 'DOCTEUR',
  });
  const doctor = await DOCTEUR.create({
    nom,
    specialite,
    username,
    password: hashedPassword,
    id_user: authUser.id_user,
  });
  return doctor;
};

/**
 * Authentification d'un utilisateur (docteur ou patient)
 */
const loginUser = async (username, password, role) => {
  const authUser = await AUTHUSER.findOne({
    where: { username, role },
  });

  if (!authUser) {
    throw new Error('Nom d’utilisateur ou mot de passe invalide');
  }

  const isMatch = await comparePassword(password, authUser.password);
  if (!isMatch) {
    throw new Error('Nom d’utilisateur ou mot de passe invalide');
  }

  let payload = { id_user: authUser.id_user, role: authUser.role };

  if (role === 'DOCTEUR') {
    const docteur = await DOCTEUR.findOne({ where: { id_user: authUser.id_user } });
    if (!docteur) throw new Error('Profil docteur introuvable');
    payload.id_docteur = docteur.id_docteur;
  }

  if (role === 'PATIENT') {
    const patient = await PATIENT.findOne({ where: { id_user: authUser.id_user } });
    if (!patient) throw new Error('Profil patient introuvable');
    payload.id_patient = patient.id_patient;
    payload.code_unique = patient.code_unique;
  }

  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtAccessExpires });
  const refreshToken = jwt.sign({ id_user: authUser.id_user }, config.jwtSecret, { expiresIn: config.jwtRefreshExpires });

  return { authUser, accessToken, refreshToken };
};


/**
 * Crée un patient et l'associe à un docteur
 */
const createPatient = async (patientData, username, password) => {
  const hashedPassword = await hashPassword(password);

  // Créer l'utilisateur AUTHUSER
  const authUser = await AUTHUSER.create({
    username,
    password: hashedPassword,
    role: 'PATIENT',
  });

  // Générer un code unique
  let code_unique;
  let isUnique = false;
  while (!isUnique) {
    code_unique = generateUniqueCode();
    const existing = await PATIENT.findOne({ where: { code_unique } });
    if (!existing) isUnique = true;
  }

  // Créer le patient et l'associer au docteur
  const patient = await PATIENT.create({
    ...patientData,
    code_unique,
    id_user: authUser.id_user,
    doctorId: patientData.doctorId, // DOCTEUR connecté
  });

  return { patient, authUser };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateAuthTokens,
  registerDoctor,
  loginUser,
  createPatient,
  generateUniqueCode
};
