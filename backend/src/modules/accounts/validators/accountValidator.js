const Joi = require('joi');

const registerDoctorSchema = Joi.object({
  nom: Joi.string().required(),
  specialite: Joi.string().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const createPatientSchema = Joi.object({
  nom: Joi.string().required(),
  age: Joi.number().integer().min(0).max(120),
  poids: Joi.number().precision(2).min(0),
  taille: Joi.number().precision(2).min(0),
  groupe_sanguin: Joi.string(),
  antecedents: Joi.string(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  code_unique: Joi.string().required(),
});

module.exports = {
  registerDoctorSchema,
  loginSchema,
  createPatientSchema,
};



