import Task from '../model/Task.js';
import User from '../model/User.js';
import mongoose from 'mongoose';

// Create task: creator is req.user._id
export const createTask = async (req, res) => {
  try {
    const { title, description, assigneeId } = req.body;
    if (!assigneeId || !mongoose.Types.ObjectId.isValid(assigneeId)) {
      return res.status(400).json({ message: 'Invalid assigneeId' });
    }
    const assignee = await User.findById(assigneeId);
    if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

    const task = new Task({ title, description, assigneeId, creatorId: req.user._id });
    await task.save();
    const populated = await Task.findById(task._id).populate('creatorId', 'name email role').populate('assigneeId', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// list: support view query param
export const listTasks = async (req, res) => {
  try {
    const view = req.query.view; // assignedToMe | assignedByMe | all
    const userId = req.user._id.toString();

    if (view === 'all') {
      if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
      const all = await Task.find().populate('creatorId', 'name email').populate('assigneeId', 'name email').sort({ createdAt: -1 });
      return res.json(all);
    }

    if (view === 'assignedToMe') {
      const tasks = await Task.find({ assigneeId: userId }).populate('creatorId', 'name email').populate('assigneeId', 'name email').sort({ createdAt: -1 });
      return res.json({ assignedToMe: tasks });
    }

    if (view === 'assignedByMe') {
      const tasks = await Task.find({ creatorId: userId }).populate('creatorId', 'name email').populate('assigneeId', 'name email').sort({ createdAt: -1 });
      return res.json({ assignedByMe: tasks });
    }

    // default: return both (for dashboard single call)
    const assignedToMe = await Task.find({ assigneeId: userId }).populate('creatorId', 'name email').populate('assigneeId', 'name email').sort({ createdAt: -1 });
    const assignedByMe = await Task.find({ creatorId: userId }).populate('creatorId', 'name email').populate('assigneeId', 'name email').sort({ createdAt: -1 });

    res.json({ assignedToMe, assignedByMe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTask = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const task = await Task.findById(id).populate('creatorId', 'name email role').populate('assigneeId', 'name email role');
    if (!task) return res.status(404).json({ message: 'Not found' });

    const uid = req.user._id.toString();
    if (task.creatorId._id.toString() !== uid && task.assigneeId._id.toString() !== uid && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, assigneeId, status } = req.body;
    const uid = req.user._id.toString();

    // title/description/assignee => only creator
    if ((title !== undefined || description !== undefined || assigneeId !== undefined) && task.creatorId.toString() !== uid) {
      return res.status(403).json({ message: 'Only creator can edit title/description/assignee' });
    }

    if (assigneeId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(assigneeId)) return res.status(400).json({ message: 'Invalid assigneeId' });
      const u = await User.findById(assigneeId);
      if (!u) return res.status(404).json({ message: 'Assignee not found' });
      task.assigneeId = assigneeId;
    }

    // status: assignee or creator can update
    if (status !== undefined) {
      const allowed = ['PENDING', 'IN_PROGRESS', 'DONE'];
      if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
      if (task.assigneeId.toString() !== uid && task.creatorId.toString() !== uid) {
        return res.status(403).json({ message: 'Not allowed to update status' });
      }
      task.status = status;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    await task.save();
    const updated = await Task.findById(id).populate('creatorId', 'name email role').populate('assigneeId', 'name email role');
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const uid = req.user._id.toString();
    if (task.creatorId.toString() !== uid) return res.status(403).json({ message: 'Only creator can delete' });

    await Task.deleteOne({ _id: id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
