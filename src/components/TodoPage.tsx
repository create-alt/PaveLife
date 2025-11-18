// src/components/TodoPage.tsx

import React, { useState } from 'react';
import type { AgeEvent, Todo } from '../types';
import { TodoItem } from './TodoItem.tsx'; // 作成したTodoItemをインポート

interface Props {
  event: AgeEvent; 
  onBack: () => void;
  // ★ App.tsxから受け取る関数を追加
  onAddNewTodo: (eventId: string, todoText: string) => void;
  onToggleTodo: (eventId: string, todoId: string) => void;
  onDeleteTodo: (eventId: string, todoId: string) => void;
  onUpdateTodoText: (eventId: string, todoId: string, newText: string) => void;
}

export const TodoPage: React.FC<Props> = ({ 
  event, 
  onBack,
  onAddNewTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodoText
}) => {
  
  // ★ 新規Todo追加フォーム用のstate
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    if (newTodoText.trim() === '') return; // 空文字は追加しない
    
    onAddNewTodo(event.id, newTodoText);
    setNewTodoText(''); // 入力欄をクリア
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-xl">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {event.age}歳: {event.title}
        </h2>
        <button
          onClick={onBack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          &larr; 道に戻る
        </button>
      </div>

      {/* ★ 1. 新規Todo追加フォーム */}
      <form onSubmit={handleAddSubmit} className="flex mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="新しいTodoを追加"
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-md"
        >
          追加
        </button>
      </form>

      {/* ★ 2. Todoリスト (TodoItemコンポーネントを使用) */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Todoリスト</h3>
        {event.todos.length === 0 ? (
          <p className="text-gray-500">Todoはまだありません。</p>
        ) : (
          <ul className="list-none m-0 p-0"> {/* スタイルをリセット */}
            {event.todos.map((todo) => (
              // ★ TodoItem コンポーネントを描画
              <TodoItem
                key={todo.id}
                todo={todo}
                // ★ App.tsx から来た関数を、TodoItemに渡す
                onToggle={() => onToggleTodo(event.id, todo.id)}
                onDelete={() => onDeleteTodo(event.id, todo.id)}
                onUpdateText={(newText) => onUpdateTodoText(event.id, todo.id, newText)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};