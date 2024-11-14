import { useState,  useCallback } from 'react';
import { Todo } from '@/app/types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
    const response = await fetch("/api/todos");
    if (!response.ok) {
      throw new Error("APIの呼び出しに失敗しました");
    }
    const data = await response.json();
    setTodos(data);
  } catch (error) {
    setError('Failed to load todos');
  } finally {
    setIsLoading(false);
  }
  }, []);

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

  return { todos, isLoading, error, fetchTodos, addTodo, toggleTodo, deleteTodo };
}