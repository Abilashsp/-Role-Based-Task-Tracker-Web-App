import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
await connectDB(process.env.MONGO_URL);

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // i.e., /api/me and /api/users
app.use('/api/tasks', taskRoutes);

// health
app.get('/', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
