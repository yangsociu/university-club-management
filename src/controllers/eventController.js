const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { title, description, clubId, location, startDate, endDate, eventType, capacity } = req.body;

    // Validation
    if (!title || !description || !clubId || !location || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is member of the club and has permission
    const userMember = club.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!userMember || (userMember.role !== 'president' && userMember.role !== 'vice-president')) {
      return res.status(403).json({
        success: false,
        message: 'Only club president or vice-president can create events',
      });
    }

    // Create event
    const event = new Event({
      title,
      description,
      club: clubId,
      location,
      startDate,
      endDate,
      eventType: eventType || 'meeting',
      capacity: capacity || 100,
      createdBy: req.user._id,
      status: 'upcoming',
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { clubId, eventType, status, page = 1, limit = 10 } = req.query;

    let query = {};

    if (clubId) query.club = clubId;
    if (eventType) query.eventType = eventType;
    if (status) query.status = status;

    // Pagination
    const skip = (page - 1) * limit;
    const events = await Event.find(query)
      .populate('club', 'name')
      .populate('createdBy', 'fullName')
      .populate('registeredParticipants.user', 'fullName profileImage')
      .skip(skip)
      .limit(Number(limit))
      .sort({ startDate: 1 });

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name description')
      .populate('createdBy', 'fullName email')
      .populate('registeredParticipants.user', 'fullName email profileImage');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Update fields
    const { title, description, startDate, endDate, eventType, capacity, status } = req.body;
    if (title) event.title = title;
    if (description) event.description = description;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (eventType) event.eventType = eventType;
    if (capacity) event.capacity = capacity;
    if (status) event.status = status;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only event creator can delete the event',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if capacity reached
    if (event.registeredParticipants.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event capacity reached',
      });
    }

    // Check if already registered
    const isRegistered = event.registeredParticipants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Register user
    event.registeredParticipants.push({
      user: req.user._id,
      status: 'registered',
      registeredAt: new Date(),
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Registered for event successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message,
    });
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
exports.cancelEventRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Remove user from registered participants
    event.registeredParticipants = event.registeredParticipants.filter(
      (p) => p.user.toString() !== req.user._id.toString()
    );

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Unregistered from event successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error canceling registration',
      error: error.message,
    });
  }
};

// @desc    Get my registered events
// @route   GET /api/events/user/registered
// @access  Private
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      'registeredParticipants.user': req.user._id,
    })
      .populate('club', 'name')
      .populate('createdBy', 'fullName')
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};
