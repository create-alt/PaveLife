// src/components/TodoModal.tsx

import React from 'react';
import type { AgeEvent, Todo } from '../types';

interface Props {
  event: AgeEvent | null; // 表示するイベント（nullなら非表示）
  onClose: () => void; // モーダルを閉じる関数
  // 今後のステップで： onUpdateTodos: (eventId: string, newTodos: Todo[]) => void;
}

export const TodoModal: React.FC<Props> = ({ event, onClose }) => {
  if (!event) return null; // eventがnullなら何も表示しない

  return (
    // オーバーレイ (画面全体を暗くする)
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40
                 flex justify-center items-center"
      onClick={onClose} // オーバーレイクリックで閉じる
    >
      {/* モーダル本体 (Tailwind CSS) */}
      <div
        className="bg-white w-11/12 md:w-1/2 max-w-lg p-6 rounded-lg shadow-xl z-50"
        onClick={(e) => e.stopPropagation()} // モーダル内部のクリックは閉じないようにする
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {event.age}歳: {event.title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times; {/* 閉じるボタン */}
          </button>
        </div>

        {/* Todoリスト */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Todoリスト</h3>
          {event.todos.length === 0 ? (
            <p className="text-gray-500">Todoはまだありません。</p>
          ) : (
            <ul className="list-disc list-inside">
              {event.todos.map((todo) => (
                <li key={todo.id} className={todo.isCompleted ? 'line-through text-gray-400' : ''}>
                  {todo.text}
                </li>
              ))}
            </ul>
          )}
          {/* 今後のステップ：Todo追加・編集フォーム */}
        </div>
      </div>
    </div>
  );
};