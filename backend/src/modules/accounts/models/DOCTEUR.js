const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const DOCTEUR = sequelize.define('DOCTEUR', {
  id_docteur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialite: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'DOCTEUR',
  freezeTableName: true,
  timestamps: true,
  underscored: false
});

DOCTEUR.associate = (models) => {
  DOCTEUR.belongsTo(models.AUTHUSER, { foreignKey: 'id_user', targetKey: 'id_user' });

  // 🔥 Association manquante → ajoutée ici
  DOCTEUR.hasMany(models.PATIENT, {
    foreignKey: 'doctorId',
    as: 'patients'
  });

  DOCTEUR.hasMany(models.CONSULTATION, { foreignKey: 'docteur_id' });
};

module.exports = DOCTEUR;
