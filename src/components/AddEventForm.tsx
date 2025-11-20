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
    <form 
      onSubmit={handleSubmit} 
      className="mb-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-3xl md:w-full mx-auto"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 border-b pb-2">
        <span>📅</span> イベントを追加
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-24 flex-shrink-0">
            <label className="block text-xs font-bold text-gray-500 mb-1">年齢</label>
            <input 
              type="number" 
              // value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min="0"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all font-bold text-center"
              placeholder=""
            />
          </div>
          
          <div className="flex-grow">
            <label className="block text-xs font-bold text-gray-500 mb-1">イベント名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              placeholder="例: 就職、結婚、海外移住..."
            />
          </div>
        </div>

        {showPathSelector && (
          <div>
            <label htmlFor="path-select" className="block text-xs font-bold text-gray-500 mb-1">
              配置する道 (ルート)
            </label>
            <select
              id="path-select"
              value={selectedPathId === null ? 'null' : selectedPathId}
              onChange={(e) => setSelectedPathId(e.target.value === 'null' ? null : e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all cursor-pointer"
            >
              <option value="null">🛣️ メインの道 (〜{currentAge}歳)</option>
              {futurePaths.map(path => (
                <option key={path.id} value={path.id}>
                  🔀 {path.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          type="submit" 
          className="py-1 px-5 bg-sky-500 rounded-2xl text-white font-black"
        >
          追加する
        </button>
      </div>
    </form>
  );
};