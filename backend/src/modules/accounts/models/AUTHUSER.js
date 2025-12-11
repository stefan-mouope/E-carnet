const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const AUTHUSER = sequelize.define('AUTHUSER', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  role: {
    type: DataTypes.ENUM('PATIENT', 'DOCTEUR'),
    allowNull: false,
  },
}, {
  tableName: 'AUTHUSER',
  freezeTableName: true,
  timestamps: true,
  underscored: false
});

module.exports = AUTHUSER;

