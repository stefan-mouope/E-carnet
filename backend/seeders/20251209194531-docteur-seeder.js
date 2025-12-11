'use strict';

const bcrypt = require('bcryptjs');
const AUTHUSER = require('../src/modules/accounts/models/AUTHUSER');
const config = require('../src/config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const authUsers = await AUTHUSER.findAll({ where: { role: 'DOCTEUR' } });
    const hashedPassword = await bcrypt.hash('MotDePasse123', config.bcryptSaltRounds);

    await queryInterface.bulkInsert('DOCTEUR', [
      {
        nom: 'Dr. Dupont',
        specialite: 'Généraliste',
        username: 'medecin1',
        password: hashedPassword,
        id_user: authUsers[0].id_user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nom: 'Dr. Martin',
        specialite: 'Pédiatre',
        username: 'medecin2',
        password: hashedPassword,
        id_user: authUsers[1].id_user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('DOCTEUR', null, {});
  },
};
