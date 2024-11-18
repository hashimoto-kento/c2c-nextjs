'use client';

import React from 'react';
import { TodoList } from '@/app/components/todo/TodoList';
import { AddTodoForm } from '@/app/components/todo/AddTodoForm';
import { useTodos } from '@/app/hooks/useTodos';

export default function Home() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <div>
      <h1 className='text-blue-500'>Todo App</h1>
      <AddTodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}