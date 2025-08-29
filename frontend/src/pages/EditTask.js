import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskForm from '../components/Taskform';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditTask() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        alert('Cannot load task');
        nav('/dashboard');
      }
    })();
  }, [id]);

  if (!task) return <div>Loading...</div>;

  // ensure TaskForm receives keys matching create/update logic
  const defaults = {
    _id: task._id || task.id,
    title: task.title,
    description: task.description,
    assigneeId: (task.assignee && (task.assignee._id || task.assignee.id)) || task.assigneeId,
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <TaskForm defaultValues={defaults} onSaved={() => nav('/dashboard')} />
    </div>
  );
}
