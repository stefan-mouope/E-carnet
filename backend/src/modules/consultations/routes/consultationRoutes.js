const express = require('express');
const consultationController = require('../controllers/consultationController');
const auth = require('../../../middlewares/auth');
const role = require('../../../middlewares/role');

const router = express.Router();

router.post('/create', auth, role('DOCTEUR'), consultationController.createConsultation);
router.get('/:patient_id/list', auth, consultationController.getConsultationsForPatient);

module.exports = router;



