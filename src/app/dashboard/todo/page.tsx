"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TodoItem } from "@/app/components/todo/TodoItem";
import { AddTodoForm } from "@/app/components/todo/AddTodoForm";
import { useTodos } from "@/app/hooks/useTodos";

export default function TodoPage() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

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
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {todos.map((todo, index) => (
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