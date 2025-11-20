// src/components/SettingsModal.tsx

import React, { useState, useEffect } from 'react';
import type { LifeData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lifeData: LifeData;
  onUpdateLifeData: (newBirthDate: string, newCurrentAge: number, newLifeExpectancy: number) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, lifeData, onUpdateLifeData }) => {
  // フォーム用のローカルstate
  const [birthDate, setBirthDate] = useState(lifeData.birthDate);
  const [currentAge, setCurrentAge] = useState(lifeData.currentAge);
  const [lifeExpectancy, setLifeExpectancy] = useState(lifeData.lifeExpectancy);

  // モーダルが開くたびに、親のデータで初期値をリセット
  useEffect(() => {
    if (isOpen) {
      setBirthDate(lifeData.birthDate);
      setCurrentAge(lifeData.currentAge);
      setLifeExpectancy(lifeData.lifeExpectancy);
    }
  }, [isOpen, lifeData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLifeData(birthDate, currentAge, lifeExpectancy);
    onClose();
  };

  return (
    // 背景のオーバーレイ
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      {/* モーダル本体 */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>⚙️</span> 設定
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          {/* 誕生日 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">誕生日</label>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none font-bold"
            />
          </div>

          <div className="flex gap-4">
            {/* 現在年齢 */}
            <div className="w-1/2">
              <label className="block text-sm font-bold text-gray-500 mb-2">現在の年齢</label>
              <input 
                type="number" 
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                min="0"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none font-bold text-center"
              />
            </div>

            {/* 想定寿命 */}
            <div className="w-1/2">
              <label className="block text-sm font-bold text-gray-500 mb-2">想定寿命 (ゴール)</label>
              <input 
                type="number" 
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                min="0"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none font-bold text-center"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
            >
              キャンセル
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-transform transform active:scale-[0.98]"
            >
              保存する
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};