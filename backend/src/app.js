const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const accountRoutes = require('./modules/accounts/routes/accountRoutes');
const patientRoutes = require('./modules/patients/routes/patientRoutes');
const consultationRoutes = require('./modules/consultations/routes/consultationRoutes');

const app = express();
app.use(morgan('dev'));
// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/accounts', accountRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!' });
});

module.exports = app;



