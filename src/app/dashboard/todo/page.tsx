"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TodoItem } from "@/app/components/todo/TodoItem";
import { AddTodoForm } from "@/app/components/todo/AddTodoForm";
import { useTodos } from "@/app/hooks/useTodos";
import { useEffect } from "react";

export default function TodoPage() {
  const {
    todos,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // ここでAPIを呼び出して並び順を更新する処理を追加する必要があります
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ToDoリスト</h1>
      <AddTodoForm onAdd={addTodo} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {Array.isArray(todos) &&
                todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoItem
                          todo={todo}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

function fetchTodos() {
  throw new Error("Function not implemented.");
}

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
