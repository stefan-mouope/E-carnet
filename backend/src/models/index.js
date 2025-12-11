  const sequelize = require('../config/database');
  const AUTHUSER = require('../modules/accounts/models/AUTHUSER');
  const DOCTEUR = require('../modules/accounts/models/DOCTEUR');
  const PATIENT = require('../modules/patients/models/PATIENT');
  const CONSULTATION = require('../modules/consultations/models/CONSULTATION');

  const models = {
    AUTHUSER,
    DOCTEUR,
    PATIENT,
    CONSULTATION,
  };

  Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

  module.exports = models;
