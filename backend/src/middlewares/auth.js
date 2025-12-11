const jwt = require('jsonwebtoken');
const config = require('../config');
const AUTHUSER = require('../modules/accounts/models/AUTHUSER');
const DOCTEUR = require('../modules/accounts/models/DOCTEUR');
const PATIENT = require('../modules/patients/models/PATIENT');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    let user = await AUTHUSER.findByPk(decoded.id_user);

    if (!user) {
      throw new Error();
    }

    // Fetch associated DOCTEUR or PATIENT data
    if (user.role === 'DOCTEUR') {
      const doctor = await DOCTEUR.findOne({ where: { id_user: user.id_user } });
      if (doctor) {
        user.id_docteur = doctor.id_docteur;
      }
    } else if (user.role === 'PATIENT') {
      const patient = await PATIENT.findOne({ where: { id_user: user.id_user } });
      if (patient) {
        user.id_patient = patient.id_patient;
        user.code_unique = patient.code_unique;
      }
    }

    req.user = user;

    next();
  } catch (err) {
    // Log the error for debugging on the server side
    console.error("Authentication error:", err.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;

