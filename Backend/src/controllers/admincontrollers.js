const mongoose = require('mongoose');
const User = require('../models/User');
const publicUser = require('../utils/publicUser');

const listPendingWorkers = async (req, res) => {
  try {
    const users = await User.find({ accountType: 'worker', status: 'pending' }).sort({
      createdAt: 1,
    });

    return res.status(200).json({ users: users.map(publicUser) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const setWorkerStatus = (status) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, accountType: 'worker', status: 'pending' },
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Pending worker not found' });
    }

    return res.status(200).json({
      message: `Worker ${status}`,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  listPendingWorkers,
  approveWorker: setWorkerStatus('active'),
  rejectWorker: setWorkerStatus('rejected'),
};