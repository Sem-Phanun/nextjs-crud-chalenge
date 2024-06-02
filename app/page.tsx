import React from 'react'
import Todo from './components/Todo'

export default function Home() {

  return (
    
    <main className='h-screen w-screen p-4 bg-slate-200'>
      <h2 className='text-3xl font-bold text-center text-gray-800 p-2'>Todo Application</h2>
      <Todo/>
    </main>
  );
}
