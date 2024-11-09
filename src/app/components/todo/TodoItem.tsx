interface Todo {
  id: string;
  title: string;
  completed: boolean;
}


interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <span
          className={`ml-3 ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {todo.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        削除
      </button>
    </div>
  )
}
