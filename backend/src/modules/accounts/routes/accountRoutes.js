const express = require('express');
const accountController = require('../controllers/accountController');
const auth = require('../../../middlewares/auth');
const role = require('../../../middlewares/role');

const router = express.Router();

router.post('/register_doctor', accountController.registerDoctor);
router.post('/login_doctor', accountController.loginDoctor);
router.post('/login_patient', accountController.loginPatient);
router.post('/create_patient', auth, role('DOCTEUR'), accountController.createPatient);

module.exports = router;



