const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const CONSULTATION = sequelize.define('CONSULTATION', {
  id_consultation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date_consultation: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  symptomes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  diagnostic: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  traitement: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ordonnance: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PATIENT',
      key: 'id_patient',
    },
  },
  docteur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'DOCTEUR',
      key: 'id_docteur',
    },
  },
}, {
  tableName: 'CONSULTATION',
  timestamps: true,
});

CONSULTATION.associate = (models) => {
  CONSULTATION.belongsTo(models.PATIENT, { foreignKey: 'patient_id' });
  CONSULTATION.belongsTo(models.DOCTEUR, { foreignKey: 'docteur_id' });
};

module.exports = CONSULTATION;

