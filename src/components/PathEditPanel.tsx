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
    <div className="mb-4 p-4 bg-gray-200 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">道（将来）の編集</h3>
      
      {/* 既存の道をリスト */}
      <div className="space-y-2 mb-4">
        {futurePaths.map(path => (
          <div key={path.id} className="p-2 bg-gray-50 rounded shadow-sm">
            {editingPathId === path.id ? (
              // --- ★ 編集モード ---
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={editPathTitle} 
                  onChange={(e) => setEditPathTitle(e.target.value)}
                  className="w-full p-1 border rounded" 
                  placeholder="道の名前"
                />
                <input 
                  type="text" 
                  value={editPathMemos}
                  onChange={(e) => setEditPathMemos(e.target.value)}
                  className="w-full p-1 border rounded" 
                  placeholder="メモ"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={handleCancelEdit} className="text-xs text-gray-600 hover:text-gray-900">キャンセル</button>
                  <button onClick={handleUpdate} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">保存</button>
                </div>
              </div>
            ) : (
              // --- ★ 通常表示 ---
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{path.title}</p>
                  <p className="text-sm text-gray-600">{path.memos || '(メモなし)'}</p>
                </div>
                <div className="flex-shrink-0 flex gap-1">
                  <button 
                    onClick={() => handleStartEdit(path)}
                    className="bg-yellow-400 px-2 py-1 rounded text-xs hover:bg-yellow-500"
                  >
                    編集
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`「${path.title}」を削除しますか？\n(この道に関連する「予定」もすべて削除されます)`)) { 
                        onDeleteFuturePath(path.id);
                      }
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
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
      <h4 className="text-md font-semibold mb-2 border-t pt-2">新しい道を追加</h4>
      <div className="flex flex-col gap-2">
        <input 
          type="text" 
          value={newPathTitle}
          onChange={(e) => setNewPathTitle(e.target.value)}
          className="p-2 border rounded" 
          placeholder="新しい道の名前 (例: Cの道)"
        />
        <input 
          type="text" 
          value={newPathMemos}
          onChange={(e) => setNewPathMemos(e.target.value)}
          className="p-2 border rounded" 
          placeholder="メモ (任意)"
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
          道を追加
        </button>
      </div>
    </div>
  );
};