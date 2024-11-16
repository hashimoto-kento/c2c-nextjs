import React from 'react';
import { Todo } from '@/app/types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete }) => (
  <li>
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
    <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {todo.text}
    </span>
    <button onClick={() => onDelete(todo.id)}>Delete</button>
  </li>
);