const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      minlength: [5, 'Event title must be at least 5 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    eventImage: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      required: [true, 'Please provide an event location'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    eventType: {
      type: String,
      enum: ['meeting', 'workshop', 'competition', 'social', 'other'],
      default: 'meeting',
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
    },
    registeredParticipants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['registered', 'attended', 'cancelled'],
          default: 'registered',
        },
      },
    ],
    participantCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
