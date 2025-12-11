const { Sequelize } = require('sequelize');
require('dotenv').config();
  

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
      underscored: false,
      timestamps: true,
    },
  }
);

// Test de connexion
sequelize.authenticate()
  .then(() => console.log('✅ Connexion DB OK !'))
  .catch(err => console.error('❌ Erreur DB:', err));

module.exports = sequelize;