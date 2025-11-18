// src/components/AddEventForm.tsx

import React, { useState } from 'react';
import type { FuturePath } from '../types';

interface Props {
  onAddEvent: (age: number, title: string, pathId: string | null) => void;
  futurePaths: FuturePath[]; // ★ 将来の道リストを受け取る
  currentAge: number;      // ★ 現在年齢を受け取る
}

export const AddEventForm: React.FC<Props> = ({ onAddEvent, futurePaths, currentAge }) => {
  const [age, setAge] = useState(25); 
  const [title, setTitle] = useState('');
  // ★ どの道に追加するかを選択する state (null はメインの道)
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    
    // ★ 年齢が「現在年齢以下」なら pathId を強制的に null (メインの道) にする
    const finalPathId = age <= currentAge ? null : selectedPathId;
    
    onAddEvent(age, title, finalPathId);
    setTitle(''); 
    setAge(25);
  };

  // ★ 年齢が未来の場合のみ、道を選択するドロップダウンを表示
  const showPathSelector = age > currentAge;

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-200 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">新しいイベントを追加</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <input 
          type="number" 
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          min="0"
          className="w-full sm:w-20 p-2 border rounded"
          placeholder="年齢"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="イベント名（例: 就職）"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
          追加
        </button>
      </div>
      
      {/* ★ 要望2: 将来の道を選択するドロップダウン */}
      {showPathSelector && (
        <div className="mt-2">
          <label htmlFor="path-select" className="block text-sm font-medium text-gray-700">
            配置する道:
          </label>
          <select
            id="path-select"
            value={selectedPathId === null ? 'null' : selectedPathId}
            onChange={(e) => setSelectedPathId(e.target.value === 'null' ? null : e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            {/* 過去の道は「メインの道」にしか追加できない */}
            <option value="null">メインの道 ( {currentAge} 歳までの道)</option>
            {futurePaths.map(path => (
              <option key={path.id} value={path.id}>
                {path.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </form>
  );
};