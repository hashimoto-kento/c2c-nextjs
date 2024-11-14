"use client";

import React from "react";
import { AddTodoForm } from "../components/todo/AddTodoForm";
import { TodoItem } from "../components/todo/TodoItem";
import { useTodos } from "@/app/hooks/useTodos";

export default function TodoSection() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Todo List</h2>
      <AddTodoForm onAdd={addTodo} />
      <ul className="space-y-2 mt-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}