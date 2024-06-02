import todos, { deleteTodoList, updateTodoList } from '@/app/libs/data';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { todo } = await req.json();
    const id = req.url?.split('todo/')[1];
    updateTodoList(id, todo);
    return NextResponse.json({
      Request_Body: todos,
      Response: 'Success',
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Error',
    });
  }
};

export const DELETE = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req.url?.split('/todo')[1];
    deleteTodoList(id);
    return NextResponse.json({
      Response: 'Success',
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Error',
    });
  }
};
