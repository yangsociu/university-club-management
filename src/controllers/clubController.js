const Club = require('../models/Club');
const User = require('../models/User');
const { validateClub } = require('../utils/validators');

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Private
exports.createClub = async (req, res) => {
  try {
    const { name, description, category, location, meetingSchedule } = req.body;

    // Validation
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, and category',
      });
    }

    // Check if club already exists
    let club = await Club.findOne({ name });
    if (club) {
      return res.status(400).json({
        success: false,
        message: 'Club with this name already exists',
      });
    }

    // Create club
    club = new Club({
      name,
      description,
      category,
      owner: req.user._id,
      location,
      meetingSchedule,
      members: [
        {
          user: req.user._id,
          role: 'president',
          joinedAt: new Date(),
        },
      ],
      memberCount: 1,
    });

    await club.save();

    // Add club to user's clubsOwned
    await User.findByIdAndUpdate(req.user._id, {
      $push: { clubsOwned: club._id },
    });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating club',
      error: error.message,
    });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getClubs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const clubs = await Club.find(query)
      .populate('owner', 'fullName email profileImage')
      .populate('members.user', 'fullName profileImage')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Club.countDocuments(query);

    res.status(200).json({
      success: true,
      count: clubs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      clubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clubs',
      error: error.message,
    });
  }
};

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Public
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('owner', 'fullName email phoneNumber profileImage')
      .populate('members.user', 'fullName email profileImage');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    res.status(200).json({
      success: true,
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching club',
      error: error.message,
    });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private
exports.updateClub = async (req, res) => {
  try {
    let club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is owner or vice-president
    const userMember = club.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!userMember || (userMember.role !== 'president' && userMember.role !== 'vice-president')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this club',
      });
    }

    // Update fields
    const { name, description, category, location, meetingSchedule, isActive } = req.body;
    if (name) club.name = name;
    if (description) club.description = description;
    if (category) club.category = category;
    if (location) club.location = location;
    if (meetingSchedule) club.meetingSchedule = meetingSchedule;
    if (isActive !== undefined) club.isActive = isActive;

    await club.save();

    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating club',
      error: error.message,
    });
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is owner
    if (club.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only club owner can delete the club',
      });
    }

    // Remove club from all members' clubsJoined
    await User.updateMany(
      { _id: { $in: club.members.map((m) => m.user) } },
      { $pull: { clubsJoined: club._id } }
    );

    // Remove club from owner's clubsOwned
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { clubsOwned: club._id },
    });

    await Club.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Club deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting club',
      error: error.message,
    });
  }
};

// @desc    Add member to club
// @route   POST /api/clubs/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId',
      });
    }

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is already a member
    const isMember = club.members.find((m) => m.user.toString() === userId.toString());

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this club',
      });
    }

    // Add member
    club.members.push({
      user: userId,
      role: 'member',
      joinedAt: new Date(),
    });

    club.memberCount = club.members.length;
    await club.save();

    // Add club to user's clubsJoined
    await User.findByIdAndUpdate(userId, {
      $push: { clubsJoined: club._id },
    });

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding member',
      error: error.message,
    });
  }
};

// @desc    Remove member from club
// @route   DELETE /api/clubs/:id/members/:userId
// @access  Private
exports.removeMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is president or vice-president
    const userMember = club.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!userMember || (userMember.role !== 'president' && userMember.role !== 'vice-president')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members',
      });
    }

    // Remove member
    club.members = club.members.filter(
      (m) => m.user.toString() !== req.params.userId.toString()
    );

    club.memberCount = club.members.length;
    await club.save();

    // Remove club from user's clubsJoined
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { clubsJoined: club._id },
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing member',
      error: error.message,
    });
  }
};

// @desc    Get clubs joined by current user
// @route   GET /api/clubs/user/joined
// @access  Private
exports.getMyClubs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('clubsJoined');

    res.status(200).json({
      success: true,
      clubs: user.clubsJoined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clubs',
      error: error.message,
    });
  }
};

// @desc    Get clubs owned by current user
// @route   GET /api/clubs/user/owned
// @access  Private
exports.getOwnedClubs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('clubsOwned');

    res.status(200).json({
      success: true,
      clubs: user.clubsOwned,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clubs',
      error: error.message,
    });
  }
};
