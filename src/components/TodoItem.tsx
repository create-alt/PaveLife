// src/components/TodoItem.tsx

import React, { useState } from 'react';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateText: (newText: string) => void; // ★ 1つの引数（新しいテキスト）のみ期待する
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onUpdateText }) => {
  // 編集モード（trueの時、テキストが入力欄になる）
  const [isEditing, setIsEditing] = useState(false);
  // 編集中のテキストを保持するstate
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim() === '') return; 
    onUpdateText(editText); // ★ 1つの引数（編集したテキスト）のみ渡す
    setIsEditing(false); 
  };
  
  // Enterキーでも更新できるようにする
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      // 変更を破棄して編集モードを終了
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center justify-between py-2 border-b border-gray-200">
      {isEditing ? (
        // (A) 編集モードの時
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleUpdate} // フォーカスが外れたら更新
          autoFocus // 編集モードになったら自動でフォーカス
          className="flex-grow mr-2 p-1 border rounded"
        />
      ) : (
        // (B) 通常表示の時
        <div className="flex items-center flex-grow">
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onToggle(todo.id)}
            className="mr-3 h-5 w-5 cursor-pointer"
          />
          <span
            className={`cursor-pointer ${todo.isCompleted ? 'line-through text-gray-400' : ''}`}
            onClick={() => setIsEditing(true)} // テキストクリックで編集モードへ
          >
            {todo.text}
          </span>
        </div>
      )}

      {/* 編集・削除ボタン */}
      <div className="flex-shrink-0">
        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="text-green-500 hover:text-green-700 mr-2"
          >
            保存
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 mr-2"
          >
            編集
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 hover:text-red-700"
        >
          削除
        </button>
      </div>
    </li>
  );
};