const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  listPendingWorkers,
  approveWorker,
  rejectWorker,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/pending-workers', listPendingWorkers);
router.patch('/users/:id/approve', approveWorker);
router.patch('/users/:id/reject', rejectWorker);

module.exports = router;