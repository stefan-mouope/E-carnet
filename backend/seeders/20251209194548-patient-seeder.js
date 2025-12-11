'use strict';

/** @type {import('sequelize-cli').Migration} */
const AUTHUSER = require('../src/modules/accounts/models/AUTHUSER');
const accountService = require('../src/modules/accounts/services/accountService');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const authUsers = await AUTHUSER.findAll({ where: { role: 'PATIENT' } });

    await queryInterface.bulkInsert('PATIENT', [
      {
        nom: 'Jean Dupont',
        age: 30,
        poids: 75.5,
        taille: 1.75,
        groupe_sanguin: 'A+',
        antecedents: 'Aucun',
        code_unique: accountService.generateUniqueCode(),
        id_user: authUsers[0].id_user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nom: 'Marie Curie',
        age: 45,
        poids: 60.2,
        taille: 1.60,
        groupe_sanguin: 'O-',
        antecedents: 'Allergie pénicilline',
        code_unique: accountService.generateUniqueCode(),
        id_user: authUsers[1].id_user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PATIENT', null, {});
  },
};
