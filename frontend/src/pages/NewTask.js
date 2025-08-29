import React from 'react';
import TaskForm from '../components/Taskform';
import { useNavigate } from 'react-router-dom';

export default function NewTask() {
  const nav = useNavigate();

  return (
    <div>
      <TaskForm onSaved={() => nav('/dashboard')} />
    </div>
  );
}
