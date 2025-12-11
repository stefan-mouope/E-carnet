const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const PATIENT = sequelize.define('PATIENT', {
  id_patient: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  poids: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  taille: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  groupe_sanguin: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  antecedents: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  code_unique: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: true,  // ou false si un patient doit obligatoirement avoir un docteur
    references: {
      model: 'DOCTEUR',
      key: 'id_docteur',
    },
  },

  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  tableName: 'PATIENT',
  freezeTableName: true,
  timestamps: true,
  underscored: false,
});

PATIENT.associate = (models) => {
  // Relation vers l'utilisateur authentifié
  PATIENT.belongsTo(models.AUTHUSER, {
    foreignKey: 'id_user',
    targetKey: 'id_user',
  });

  // Relation vers le docteur (clé doctorId)
  PATIENT.belongsTo(models.DOCTEUR, {
    foreignKey: 'doctorId',
    as: 'docteur',
  });

  // Relation vers consultations
  PATIENT.hasMany(models.CONSULTATION, {
    foreignKey: 'patient_id',
    as: 'consultations',
  });
};

module.exports = PATIENT;
