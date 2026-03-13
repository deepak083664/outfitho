const express = require('express');
const { authUser, registerUser, getUsers, deleteUser, toggleBlockUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authUser);

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/block')
  .put(protect, admin, toggleBlockUser);

module.exports = router;
