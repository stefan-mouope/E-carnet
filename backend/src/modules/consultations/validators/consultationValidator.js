const Joi = require('joi');

const createConsultationSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  symptomes: Joi.string(),
  diagnostic: Joi.string(),
  traitement: Joi.string(),
  ordonnance: Joi.string(),
  notes: Joi.string(),
});

module.exports = {
  createConsultationSchema,
};



