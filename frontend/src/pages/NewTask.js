import React from 'react';
import TaskForm from '../components/Taskform';
import { useNavigate } from 'react-router-dom';

export default function NewTask() {
  const nav = useNavigate();

  return (
    <div className='w-full h-full py-6'>
      <TaskForm onSaved={() => nav('/dashboard')} />
    </div>
  );
}
