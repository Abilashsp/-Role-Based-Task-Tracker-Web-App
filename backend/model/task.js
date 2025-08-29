import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, minlength: 5, maxlength: 2000 },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'DONE'], default: 'PENDING' },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
