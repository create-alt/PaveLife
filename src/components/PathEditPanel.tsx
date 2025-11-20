// src/components/PathEditPanel.tsx

import React, { useState } from 'react';
import type { FuturePath } from '../types';

interface Props {
  futurePaths: FuturePath[];
  onAddFuturePath: (title: string, memos: string) => void;
  onDeleteFuturePath: (pathId: string) => void;
  onUpdateFuturePath: (pathId: string, newTitle: string, newMemos: string) => void;
}

export const PathEditPanel: React.FC<Props> = ({ 
  futurePaths, onAddFuturePath, onDeleteFuturePath, onUpdateFuturePath 
}) => {
  // --- 新しい道を追加するための State ---
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathMemos, setNewPathMemos] = useState('');

  // --- ★既存の道を編集するための State ---
  const [editingPathId, setEditingPathId] = useState<string | null>(null);
  const [editPathTitle, setEditPathTitle] = useState('');
  const [editPathMemos, setEditPathMemos] = useState('');

  // --- ハンドラ関数 ---

  const handleAdd = () => {
    if (newPathTitle.trim() === '') return;
    onAddFuturePath(newPathTitle, newPathMemos);
    setNewPathTitle('');
    setNewPathMemos('');
  };

  // ★ 編集開始
  const handleStartEdit = (path: FuturePath) => {
    setEditingPathId(path.id);
    setEditPathTitle(path.title);
    setEditPathMemos(path.memos);
  };

  // ★ 編集キャンセル
  const handleCancelEdit = () => {
    setEditingPathId(null);
  };

  // ★ 編集内容を保存
  const handleUpdate = () => {
    if (editingPathId === null || editPathTitle.trim() === '') return;
    onUpdateFuturePath(editingPathId, editPathTitle, editPathMemos);
    setEditingPathId(null); // 編集モード終了
  };

  return (
    // ★ 修正: カード風のスタイリング
    <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center gap-2">
        <span className="text-2xl">🛣️</span> 将来の道を編集
      </h3>
      
      {/* 既存の道をリスト */}
      <div className="space-y-3 mb-6">
        {futurePaths.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-2">将来の道はまだありません</p>
        )}
        
        {futurePaths.map(path => (
          <div key={path.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:shadow-md">
            {editingPathId === path.id ? (
              // --- 編集モード ---
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">道の名前</label>
                  <input 
                    type="text" 
                    value={editPathTitle} 
                    onChange={(e) => setEditPathTitle(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">メモ</label>
                  <input 
                    type="text" 
                    value={editPathMemos}
                    onChange={(e) => setEditPathMemos(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none" 
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={handleCancelEdit} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">キャンセル</button>
                  <button onClick={handleUpdate} className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg shadow hover:bg-green-600">保存</button>
                </div>
              </div>
            ) : (
              // --- 通常表示 ---
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-800">{path.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{path.memos || '(メモなし)'}</p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button 
                    onClick={() => handleStartEdit(path)}
                    className="px-3 py-1.5 bg-yellow-400 text-white font-bold rounded-lg text-xs shadow hover:bg-yellow-500 transition-transform transform active:scale-95"
                  >
                    編集
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`道「${path.title}」を削除しますか？\n(この道に関連する「予定」もすべて削除されます)`)) {
                        onDeleteFuturePath(path.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-400 text-white font-bold rounded-lg text-xs shadow hover:bg-red-500 transition-transform transform active:scale-95"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 新しい道を追加するフォーム */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-bold text-gray-500 mb-3">＋ 新しい道を追加</h4>
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            value={newPathTitle}
            onChange={(e) => setNewPathTitle(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all" 
            placeholder="道の名前 (例: 起業ルート)"
          />
          <input 
            type="text" 
            value={newPathMemos}
            onChange={(e) => setNewPathMemos(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all" 
            placeholder="メモ (任意)"
          />
          <button 
            onClick={handleAdd} 
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl shadow-md transition-transform transform active:scale-95"
          >
            道を追加
          </button>
        </div>
      </div>
    </div>
  );
};