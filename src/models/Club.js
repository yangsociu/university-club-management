const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a club name'],
      trim: true,
      minlength: [3, 'Club name must be at least 3 characters long'],
      maxlength: [100, 'Club name must not exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    category: {
      type: String,
      enum: [
        'sports',
        'arts',
        'academic',
        'social',
        'technology',
        'culture',
        'other',
      ],
      required: [true, 'Please provide a category'],
    },
    clubImage: {
      type: String,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['member', 'vice-president', 'president'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    memberCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    meetingSchedule: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'as-needed'],
      default: 'as-needed',
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('Club', clubSchema);
