import User from '../model/User.js';
import Task from '../model/Task.js';

import mongoose from 'mongoose';

export const listUsers = async (req, res) => {
  try {
    const excludeId = req.user.id; // from protect middleware

    const users = await User.find({ _id: { $ne: excludeId } })
      .select('_id name email role')
      .sort({ name: 1 });

    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// PATCH /api/users/:id (admin) -> update name, email, role, active
export const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const { name, email, role, active } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (email !== undefined) updates.email = String(email).trim().toLowerCase();
    if (role !== undefined) {
      const allowed = ['ADMIN', 'MEMBER'];
      if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' });
      updates.role = role;
    }
    if (active !== undefined) updates.active = !!active;

    const user = await User.findByIdAndUpdate(id, updates, { new: true, select: '_id name email role active' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// DELETE /api/users/:id (admin) -> delete user
export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    // Prevent deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Find the user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    // Delete all tasks created by or assigned to this user
    const deletedTasks = await Task.deleteMany({
      $or: [{ creatorId: id }, { assigneeId: id }]
    });

    res.json({
      message: 'User and related tasks deleted successfully',
      userId: id,
      deletedTasksCount: deletedTasks.deletedCount
    });
  } catch (err) {
    console.error('Error deleting user and tasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
