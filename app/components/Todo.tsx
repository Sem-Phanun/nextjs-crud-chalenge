'use client';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface Todo {
  id: string;
  todo: string;
  isCompleted: boolean;
  createAt: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTodo, setInputTodo] = useState<string>('');
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isEditTodo, setIsEditTodo] = useState<boolean>(false);
  const [isEditById, setIsEditById] = useState<string | null>(null);

  useEffect(() => {
    getAllTodoList();
  }, []);

  const getAllTodoList = async () => {
    const res = await axios.get('/api/todo');
    const results = res.data.todos;
    console.log('data', results);
    setTodos(results);
    setFilteredTodos(results);
  };

  const handleSubmit = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTodo(event.target.value);
    filterTodo(event.target.value);
  };

  const handleInput = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedInput = inputTodo.trim().toLowerCase();

    if (!trimmedInput) {
      alert("Todo list can't be empty");
      return;
    }
    const isDuplicate = todos.some((todo) => todo.todo.toLowerCase() === trimmedInput.toLowerCase());
    if (isDuplicate) {
      alert("Item can't be duplicate");
      return;
    }

    try {
      if (isEditTodo && isEditById) {
        await updateExistingTodo();
      } else {
        await createNewTodo();
      }
    } catch (error) {
      console.error("Error updating or creating todo:", error);
    }
    setInputTodo('');
  };

  //Create New Todo Item
  const createNewTodo = async () => {
    const response = await axios.post('/api/todo', {
      id: uuidv4(),
      todo: inputTodo,
      isCompleted: false,
      createAt: new Date(),
    });
    setTodos([...todos, response.data]);
    getAllTodoList();
  };

  // Update an existing Todo Item
  const updateExistingTodo = async () => {
    try {
      await axios.put(`/api/todo/${isEditById}`, { todo: inputTodo });
      const updatedTodos = todos.map((todo) =>
        todo.id === isEditById ? { todo: inputTodo } : todo
      );
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos);
      console.log('After update', updatedTodos);
      getAllTodoList();
      setIsEditTodo(false);
      setIsEditById(null);
    } catch (err) {
      console.log('Error updating todo', err);
    }
  };

  //check the item to complete status
  const handleOnComplete = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
    setFilteredTodos(updatedTodos);
  };

  // Set todo for editing
  const handleEditTodo = (id: string) => {
    const itemToEdit = todos.find((todo) => todo.id === id);
    if (itemToEdit) {
      setInputTodo(itemToEdit.todo);
      console.log('itemToEdit', itemToEdit.todo);
      setIsEditTodo(true);
      setIsEditById(id);
    }
  };

  // Delete a todo
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/todo/${id}`);
      const temp_data = todos.filter((item) => item.id !== id);
      setTodos(temp_data);
      setFilteredTodos(temp_data);
      console.log(temp_data);
    } catch (err) {
      console.log('Error Deleting todo item!', err);
    }
  };

  // Helper to filter todos
  const helperFilter = (query: string, like: string) => {
    let i = 0;
    for (let j = 0; j < like.length; j++) {
      if (query[i] === like[j]) {
        i++;
      }
    }
    return i === query.length;
  };

  // Filter todos based on input text
  const filterTodo = (input: string) => {
    if (input.trim() === '') {
      setFilteredTodos(todos);
      return;
    }
    const result = todos.filter((todo) =>
      helperFilter(input.toLowerCase(), todo.todo.toLowerCase())
    );
    setFilteredTodos(result);
  };

  return (
    <main className="bg-slate-100 max-w-[600px] w-full m-auto rounded-md shadow-xl p-4">
      <form onSubmit={handleInput} className="flex justify-between">
        <input
          type="text"
          value={inputTodo}
          onChange={handleSubmit}
          className="border p-2 w-full text-xl outline-none"
        />
        <button
          type="submit"
          className="border p-4 ml-2 bg-purple-500 text-slate-100"
        >
          {isEditTodo ? 'Update' : 'Add'}
        </button>
      </form>

      <ul>
        {filteredTodos.length > 0 ? (
          filteredTodos.map((item, index) => (
            <div key={index}>
              <li className="flex justify-between bg-slate-200 p-4 my-2 capitalize items-center">
                <span className={item.isCompleted ? 'line-through' : ''}>
                  {item.todo}
                </span>
                <button
                  onClick={() => handleOnComplete(item.id)}
                  className="border p-2 ml-2 bg-purple-500 text-slate-100 cursor-pointer flex items-center"
                >
                  {item.isCompleted ? 'Mark as InComplete' : 'Mark as Complete'}
                </button>
                <button
                  onClick={() => handleEditTodo(item.id)}
                  className="border p-2 ml-2 bg-blue-500 text-slate-100 cursor-pointer flex items-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="border p-2 ml-2 bg-red-500 text-slate-100 cursor-pointer flex items-center"
                >
                  Delete
                </button>
              </li>
            </div>
          ))
        ) : (
          <li>No result. Create a new one instead!</li>
        )}
      </ul>
    </main>
  );
};

export default TodoList;
