const express = require('express');
const {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  addMember,
  removeMember,
  getMyClubs,
  getOwnedClubs,
} = require('../controllers/clubController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getClubs);

// User's clubs (MUST be before /:id)
router.get('/user/joined', protect, getMyClubs);
router.get('/user/owned', protect, getOwnedClubs);

// Routes with ID parameter
router.get('/:id', getClubById);

// Private routes (require authentication)
router.post('/', protect, createClub);
router.put('/:id', protect, updateClub);
router.delete('/:id', protect, deleteClub);

// Member management
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;
