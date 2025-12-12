const express = require('express');
const patientController = require('../controllers/patientController');
const auth = require('../../../middlewares/auth');
const role = require('../../../middlewares/role');
const { verifyPatientCode } = require('../controllers/patientController');


const router = express.Router();

// Routes spécifiques AVANT les routes dynamiques
router.get('/doctor/me', auth, role('DOCTEUR'), patientController.getDoctorPatients);
router.get('/me', auth, patientController.getPatientMe);
router.post('/verify-code', verifyPatientCode);
router.post('/search-by-code', auth, role('DOCTEUR'), patientController.searchPatientByCode);

// Routes dynamiques APRÈS
router.put('/:id/update', auth, role('DOCTEUR'), patientController.updatePatient);
// router.get('/:id', auth, role('DOCTEUR'), patientController.getPatientById);
router.get('/:id', auth, patientController.getPatientById);
module.exports = router;
