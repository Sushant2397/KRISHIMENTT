import { useEffect, useState } from "react";
import { todosApi } from "../services/api";  // ✅ use shared API

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await todosApi.getAll();
        setTodos(data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (loading) return <p>Loading todos...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
