// src/components/TodoPage.tsx

import React, { useState, useEffect } from 'react';
import type { AgeEvent } from '../types';
import { TodoItem } from './TodoItem.tsx'; 

interface Props {
  event: AgeEvent; 
  onBack: () => void;
  onAddNewTodo: (eventId: string, todoText: string) => void;
  onToggleTodo: (eventId: string, todoId: string) => void;
  onDeleteTodo: (eventId: string, todoId: string) => void;
  onUpdateTodoText: (eventId: string, todoId: string, newText: string) => void;
  onUpdateEvent: (eventId: string, newAge: number, newTitle: string) => void;
}

export const TodoPage: React.FC<Props> = ({ 
  event, 
  onBack,
  onAddNewTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodoText,
  onUpdateEvent 
}) => {
  const [newTodoText, setNewTodoText] = useState('');
  
  // タイトル編集用のローカルState
  const [editTitle, setEditTitle] = useState(event.title);

  // eventが変わったらStateも更新
  useEffect(() => {
    setEditTitle(event.title);
  }, [event]);

  // 編集内容を保存する関数
  const handleSaveEventInfo = () => {
    if (editTitle.trim() === '') return;
    // ★ 年齢は編集不可なので、event.age をそのまま渡す
    onUpdateEvent(event.id, event.age, editTitle);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;
    onAddNewTodo(event.id, newTodoText);
    setNewTodoText(''); 
  };

  return (
    <div className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-2xl mx-auto my-4 border border-gray-100">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-6">
        
        <div className="flex items-center gap-3 flex-grow w-full md:w-auto">
          
          {/* ★ 修正: 年齢を入力不可（表示のみ）に変更 */}
          <div className="flex flex-col w-24 flex-shrink-0">
            <label className="text-xs font-bold text-gray-400 ml-1">年齢</label>
            <div className="text-3xl font-bold text-blue-600 bg-transparent px-2 py-1 text-center cursor-default select-none">
              {event.age}
              <span className="text-sm text-gray-400 ml-1 font-normal">歳</span>
            </div>
          </div>
          
          <div className="flex flex-col flex-grow">
            <label className="text-xs font-bold text-gray-400 ml-1">イベント名</label>
            <input 
              type="text" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEventInfo} // フォーカスが外れたら保存
              className="text-3xl font-bold text-gray-800 bg-gray-50 border border-transparent hover:border-gray-200 focus:border-blue-400 rounded-lg px-2 py-1 w-full transition-all focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-6 rounded-xl transition-colors"
        >
          &larr; 道に戻る
        </button>
      </div>

      {/* 新規Todo追加フォーム */}
      <form onSubmit={handleAddSubmit} className="flex mb-8 shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="新しいTodoを追加..."
          className="flex-grow p-4 outline-none text-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 transition-colors"
        >
          追加
        </button>
      </form>

      {/* Todoリスト */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span>📝</span> Todoリスト
        </h3>
        {event.todos.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
            Todoはまだありません。<br/>上のフォームから追加してください。
          </div>
        ) : (
          <ul className="list-none space-y-3"> 
            {event.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
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