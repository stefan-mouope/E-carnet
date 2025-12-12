const app = require('./app');
const sequelize = require('./config/database');
const models = require('./models'); // Assure-toi d'importer tous les modèles

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // Synchronisation automatique des modèles
    // alter: true → adapte la table à ton modèle sans perdre de données
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
