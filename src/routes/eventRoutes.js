const express = require('express');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerEvent,
  cancelEventRegistration,
  getMyEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Private routes
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

// Event registration
router.post('/:id/register', protect, registerEvent);
router.delete('/:id/register', protect, cancelEventRegistration);

// User's events
router.get('/user/registered', protect, getMyEvents);

module.exports = router;
