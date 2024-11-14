import { useState, useEffect } from 'react';
import { Todo } from '@/app/types';
import { set } from 'zod';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
    const response = await fetch("/api/todos");
    if (!response.ok) {
      throw new Error("APIの呼び出しに失敗しました");
    }
    const data = await response.json();
    setTodos(data);
  } catch (error) {
    console.error(error);
    setTodos([]);
  }
  };

  const addTodo = async (title: string) => {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const newTodo = await response.json();
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
}