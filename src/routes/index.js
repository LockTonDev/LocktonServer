const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => res.send('Welcome to Lockton API Server /'));

router.use('/auth', require('./authRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/email', require('./emailRoutes'));
router.use('/template', require('./templateRoutes'));
router.use('/board', require('./board'));
// ======================================
router.use('/ADM/', require('./R_ADMIN'));
//router.use('/locktom_A/', require('./R_ADMIN'));
// ======================================
router.use('/COMMON/', require('./R_COMMON'));
router.use('/CAA/CAA0030A', require('./R_TCAA0030A'));
router.use('/ACC/ACC0030A', require('./R_TACC0030A'));
router.use('/TAX/TAX0030A', require('./R_TTAX0030A'));
router.use('/ADV/ADV0030A', require('./R_TADV0030A'));
router.use('/LAW/LAW0030A', require('./R_TLAW0030A'));
router.use('/PAT/PAT0030A', require('./R_TPAT0030A'));
router.use('/CAA/CAA0030A', require('./R_TCAA0030A'));
router.use('/CAA/CAA0040A', require('./R_TCAA0040A'));
router.use('/TAX/TAX0040A', require('./R_TTAX0040A'));
router.use('/ADV/ADV0040A', require('./R_TADV0040A'));
router.use('/LAW/LAW0040A', require('./R_TLAW0040A'));
router.use('/PAT/PAT0040A', require('./R_TPAT0040A'));

module.exports = router;
