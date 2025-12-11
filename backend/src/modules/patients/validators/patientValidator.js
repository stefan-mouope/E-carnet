const Joi = require('joi');

const updatePatientSchema = Joi.object({
  nom: Joi.string(),
  age: Joi.number().integer().min(0).max(120),
  poids: Joi.number().precision(2).min(0),
  taille: Joi.number().precision(2).min(0),
  groupe_sanguin: Joi.string(),
  antecedents: Joi.string(),
});

module.exports = {
  updatePatientSchema,
};



