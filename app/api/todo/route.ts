import { NextApiRequest, NextApiResponse } from 'next';
import todos, { addTodoList, getTodoList } from '../../libs/data';
import { v4 as uuidv4 } from 'uuid';
export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const todos = getTodoList();
    return Response.json({
      todos: todos,
      Response: 'Success',
    });
  } catch (error) {
    return Response.json({
      message: 'Error',
    });
  }
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { todo } = await req.json();
  try {
    const addItem = {
      todo,
      isCompleted: Boolean,
      createAt: new Date().toString(),
      id: uuidv4(),
    };
    addTodoList(addItem);
    return Response.json({
      Request_Body: todos,
      message: 'Success',
    });
  } catch (error) {
    return Response.json({
      message: 'Error',
      todos,
    });
  }
};
