'use strict';

const bcrypt = require('bcryptjs');
const config = require('../src/config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('MotDePasse123', config.bcryptSaltRounds);

    await queryInterface.bulkInsert('AUTHUSER', [
      {
        username: 'medecin1',
        password: hashedPassword,
        role: 'DOCTEUR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'medecin2',
        password: hashedPassword,
        role: 'DOCTEUR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'patient1',
        password: hashedPassword,
        role: 'PATIENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'patient2',
        password: hashedPassword,
        role: 'PATIENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AUTHUSER', null, {});
  },
};
