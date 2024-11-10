// app/components/TodoSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { AddTodoForm } from "../components/todo/AddTodoForm";
import { TodoItem } from "../components/todo/TodoItem";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function TodoSection() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (title: string) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error("Error adding todo:", error);
      // ここでエラーメッセージを表示するなどの処理を追加
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

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
