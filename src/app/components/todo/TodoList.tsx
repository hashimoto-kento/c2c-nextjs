import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/app/types';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onToggle, onDelete }) => (
  <ul>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ))}
  </ul>
);