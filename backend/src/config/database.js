const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'postgresql://neondb_owner:npg_qe2zxvfolyL0@ep-wandering-firefly-ahubgluo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  }
);

sequelize.createSchema('auth', { logging: false }).catch(() => {});

module.exports = sequelize;
