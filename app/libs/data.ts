import { v4 as uuidv4 } from 'uuid';
interface Todo {
  id: string;
  todo: string;
  isCompleted: boolean;
  createAt: Date;
}

let todos: Todo[] = [
  {
    id: uuidv4(),
    todo: 'buy some food',
    isCompleted: false,
    createAt: new Date(),
  },
  {
    id: uuidv4(),
    todo: "buy some drink",
    isCompleted: true,
    createAt: new Date()
  } 
];
export const getTodoList = () => todos;

export const addTodoList = (todo: Todo) => {
  todos.push(todo);
};

export const deleteTodoList = (id: string) => {
  let tmp_data = todos.filter((todo) => todo.id != id);
};
export const updateTodoList = (id: string, todo: string) => {
  const itemToUpdate = todos.find((todo) => todo.id != id);

  if (itemToUpdate) {
    itemToUpdate.todo = todo;
  } else {
    throw new Error('error');
  }
};
export default todos;
