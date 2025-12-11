'use strict';

/** @type {import('sequelize-cli').Migration} */
const PATIENT = require('../src/modules/patients/models/PATIENT');
const DOCTEUR = require('../src/modules/accounts/models/DOCTEUR');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const patients = await PATIENT.findAll();
    const doctors = await DOCTEUR.findAll();

    await queryInterface.bulkInsert('CONSULTATION', [
      {
        date_consultation: new Date(),
        symptomes: 'Fièvre et toux',
        diagnostic: 'Grippe',
        traitement: 'Repos et paracétamol',
        ordonnance: 'Aucune',
        notes: 'Patient réactif au traitement.',
        patient_id: patients[0].id_patient,
        docteur_id: doctors[0].id_docteur,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date_consultation: new Date(),
        symptomes: 'Douleurs abdominales',
        diagnostic: 'Gastro-entérite',
        traitement: 'Hydratation et régime léger',
        ordonnance: 'Anti-diarrhéique',
        notes: 'Conseils alimentaires donnés.',
        patient_id: patients[0].id_patient,
        docteur_id: doctors[1].id_docteur,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date_consultation: new Date(),
        symptomes: 'Maux de tête persistants',
        diagnostic: 'Migraine',
        traitement: 'Anti-inflammatoires',
        ordonnance: 'N/A',
        notes: 'À surveiller.',
        patient_id: patients[1].id_patient,
        docteur_id: doctors[0].id_docteur,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CONSULTATION', null, {});
  },
};
