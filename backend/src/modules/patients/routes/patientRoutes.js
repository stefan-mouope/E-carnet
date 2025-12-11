const express = require('express');
const patientController = require('../controllers/patientController');
const auth = require('../../../middlewares/auth');
const role = require('../../../middlewares/role');

const router = express.Router();

// Routes spécifiques AVANT les routes dynamiques
router.get('/doctor/me', auth, role('DOCTEUR'), patientController.getDoctorPatients);
router.get('/me', auth, patientController.getPatientMe);

// Routes dynamiques APRÈS
router.put('/:id/update', auth, role('DOCTEUR'), patientController.updatePatient);
router.get('/:id', auth, role('DOCTEUR'), patientController.getPatientById);

module.exports = router;
