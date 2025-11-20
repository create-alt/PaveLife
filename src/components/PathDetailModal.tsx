// src/components/PathDetailModal.tsx

import React, { useState, useEffect } from 'react';
import type { FuturePath } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  path: FuturePath | null;
  onUpdateFuturePath: (pathId: string, newTitle: string, newMemos: string) => void;
  onDeleteFuturePath: (pathId: string) => void;
}

export const PathDetailModal: React.FC<Props> = ({ 
  isOpen, onClose, path, onUpdateFuturePath, onDeleteFuturePath 
}) => {
  const [title, setTitle] = useState('');
  const [memos, setMemos] = useState('');

  useEffect(() => {
    if (path) {
      setTitle(path.title);
      setMemos(path.memos);
    }
  }, [path, isOpen]);

  if (!isOpen || !path) return null;

  const handleSave = () => {
    if (title.trim() === '') return;
    onUpdateFuturePath(path.id, title, memos);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`道「${path.title}」を削除しますか？\n(この道にあるイベントもすべて削除されます)`)) {
      onDeleteFuturePath(path.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">🛣️ 道の編集</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">道の名前</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 font-bold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">メモ</label>
            <textarea 
              value={memos}
              onChange={(e) => setMemos(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 min-h-[100px]"
              placeholder="この道に関するメモ..."
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleDelete} className="px-4 py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200">
              削除
            </button>
            <div className="flex-grow flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300">
                キャンセル
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 shadow-md">
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};