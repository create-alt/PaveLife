// src/components/LifePath.tsx

import React, { useState } from 'react'; 
import type { LifeData, AgeEvent, FuturePath } from '../types';
import { AddEventForm } from './AddEventForm.tsx'; // ★ 分離したフォーム
import { PathEditPanel } from './PathEditPanel.tsx'; // ★ 新しく作成したファイルをインポート

// ★ LifePath メインコンポーネント
interface Props {
  lifeData: LifeData;
  onAgeEventClick: (event: AgeEvent) => void;
  // イベント編集
  isEditing: boolean;
  onAddEvent: (age: number, title: string, pathId: string | null) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (eventId: string, newAge: number, newTitle: string) => void;
  // 道編集
  isPathEditing: boolean;
  onAddFuturePath: (title: string, memos: string) => void;
  onDeleteFuturePath: (pathId: string) => void;
  onUpdateFuturePath: (pathId: string, newTitle: string, newMemos: string) => void;
}

// ★ LifePath メインコンポーネント
interface Props {
  lifeData: LifeData;
  onAgeEventClick: (event: AgeEvent) => void;
  // イベント編集
  isEditing: boolean;
  onAddEvent: (age: number, title: string, pathId: string | null) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (eventId: string, newAge: number, newTitle: string) => void;
  // 道編集
  isPathEditing: boolean;
  onAddFuturePath: (title: string, memos: string) => void;
  onDeleteFuturePath: (pathId: string) => void;
  onUpdateFuturePath: (pathId: string, newTitle: string, newMemos: string) => void;
}

const PATH_WIDTH = 10; 
const PATH_GAP = 80;   
const TOTAL_PATH_WIDTH = PATH_WIDTH + PATH_GAP; 
const YEAR_HEIGHT_PX = 12.5; 
const MIN_EVENT_GAP_PX = 40; 


export const LifePath: React.FC<Props> = ({ 
  lifeData, 
  onAgeEventClick,
  isEditing,
  onAddEvent,
  onDeleteEvent,
  onUpdateEvent,
  isPathEditing,
  onAddFuturePath,
  onDeleteFuturePath,
  onUpdateFuturePath
}) => {
  
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ age: 0, title: '' });

  const { currentAge, lifeExpectancy, events, futurePaths } = lifeData;
  
  // ★★★ 要望1: Y座標の計算ロジックを修正 ★★★
  const sortedEvents = [...events].sort((a, b) => a.age - b.age);
  const eventYCoordinates = new Map<string, number>();
  
  // ★ 道(track)ごとに、最後のY座標を記憶するMap
  // キー: pathId (null含む), 値: Y座標
  const lastEventYByPath = new Map<string | null, number>();

  for (const event of sortedEvents) {
    // 1. このイベントが所属する「道（track）」を決定する
    //    現在年齢以下のイベントは、強制的にメインの道(null)扱い
    const trackKey = event.age <= currentAge ? null : event.pathId;

    // 2. この「道（track）」の、直前のイベントY座標を取得
    const lastEventY = lastEventYByPath.get(trackKey) ?? -MIN_EVENT_GAP_PX;

    // 3. この道の最小間隔を考慮してY座標を計算
    const eventY_raw = event.age * YEAR_HEIGHT_PX;
    const calculatedY = Math.max(eventY_raw, lastEventY + MIN_EVENT_GAP_PX);
    
    // 4. 計算結果を保存
    eventYCoordinates.set(event.id, calculatedY);
    
    // 5. この「道（track）」の最後のY座標を更新
    lastEventYByPath.set(trackKey, calculatedY);
  }

  // ★ 「過去の道」（実線）の終点を計算
  //    メインの道(null)の最後のY座標、または現在年齢のY座標の、大きい方
  const lastPastEventY = lastEventYByPath.get(null) ?? 0;
  const currentAgeY_raw = currentAge * YEAR_HEIGHT_PX;
  const currentAgeY_visual = Math.max(currentAgeY_raw, lastPastEventY);

  // ★ 全体の高さを計算
  //    全ての道の中で、最もY座標が大きい値を探す
  const maxCalculatedY = Math.max(0, ...Array.from(lastEventYByPath.values()));
  
  const maxAgeInEvents = Math.max(...events.map(e => e.age), 0);
  const effectiveLifeExpectancy = Math.max(lifeExpectancy, maxAgeInEvents, currentAge);
  const rawViewHeight = effectiveLifeExpectancy * YEAR_HEIGHT_PX;
  
  const viewHeight = Math.max(rawViewHeight, maxCalculatedY) + MIN_EVENT_GAP_PX;
  // ★★★ Y座標ロジック 修正ここまで ★★★


  // --- X軸の計算 (変更なし) ---
  const numPaths = futurePaths.length;
  const viewWidth = Math.max(300, (numPaths + 1) * TOTAL_PATH_WIDTH);
  const centerX = viewWidth / 2; 

  const getPathX = (pathIndex: number) => {
    const offset = numPaths === 1 ? 0.5 : (numPaths - 1) / 2;
    return centerX + (pathIndex - offset) * TOTAL_PATH_WIDTH;
  };
  
  // ★ getEventX は、イベントが正しい道に配置されるよう、このまま（修正済み）
  const getEventX = (event: AgeEvent) => {
    if (event.pathId === null || event.age <= currentAge) {
      return centerX; 
    }
    const pathIndex = futurePaths.findIndex(p => p.id === event.pathId);
    if (pathIndex === -1) {
      return centerX; 
    }
    return getPathX(pathIndex); 
  };
  // --- X軸の計算 (ここまで) ---

  // --- 編集ハンドラ (変更なし) ---
  const handleStartEditing = (event: AgeEvent) => {
    setEditingEventId(event.id);
    setEditFormData({ age: event.age, title: event.title });
  };
  const handleCancelEditing = () => {
    setEditingEventId(null);
  };
  const handleUpdateSubmit = () => {
    if (editingEventId === null) return;
    onUpdateEvent(editingEventId, editFormData.age, editFormData.title);
    setEditingEventId(null); 
  };
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: name === 'age' ? Number(value) : value }));
  };
  // --- 編集ハンドラ (ここまで) ---

  return (
    <div className="w-full max-w-md">
      
      {/* イベント編集フォーム */}
      {isEditing && (
        <AddEventForm 
          onAddEvent={onAddEvent}
          futurePaths={futurePaths}
          currentAge={currentAge}
        />
      )}
      
      {/* ★ 道編集パネル (インポートしたコンポーネントを呼び出す) */}
      {isPathEditing && (
        <PathEditPanel 
          futurePaths={futurePaths}
          onAddFuturePath={onAddFuturePath}
          onDeleteFuturePath={onDeleteFuturePath}
          onUpdateFuturePath={onUpdateFuturePath}
        />
      )}
      
      {/* 道の描画エリア */}
      <div 
        className="relative bg-gray-100 overflow-hidden mx-auto border border-gray-300 overflow-x-auto"
        style={{ width: viewWidth, height: viewHeight }} 
      >
        {/* SVG描画 (変更なし) */}
        <svg 
          width={viewWidth} 
          height={viewHeight} 
          className="absolute top-0 left-0"
        >
          {/* 1. 過去の道 */}
          <path 
            d={`M ${centerX},0 V ${currentAgeY_visual}`} 
            stroke="black" 
            strokeWidth={PATH_WIDTH} 
            fill="none" 
          />
          {/* 2. 未来の道 (分岐なし) */}
          {numPaths === 0 && (
            <path 
              d={`M ${centerX},${currentAgeY_visual} V ${viewHeight}`}
              stroke="black" 
              strokeWidth={PATH_WIDTH} 
              strokeDasharray="10 10" 
              fill="none" 
            />
          )}
          {/* 3. 直角に分岐する道を描画 */}
          {futurePaths.map((path, index) => {
            const futurePathX = getPathX(index); 
            return (
              <g key={path.id}>
                <text 
                  x={futurePathX} 
                  y={currentAgeY_visual + 25} 
                  textAnchor="middle" 
                  className="fill-gray-600 text-sm cursor-pointer" 
                  onClick={() => !isEditing && !isPathEditing && alert(`道: ${path.title}\nメモ: ${path.memos}`)}
                >
                  {path.title}
                </text>
                <path
                  d={
                    `M ${centerX},${currentAgeY_visual} ` + 
                    `H ${futurePathX} ` + 
                    `V ${viewHeight}`
                  } 
                  stroke="gray" 
                  strokeWidth={PATH_WIDTH} 
                  strokeDasharray="10 10" 
                  fill="none" 
                  className="hover:stroke-blue-500" 
                />
              </g>
            );
          })}
        </svg>

        {/* 4. 年齢イベントボタンの配置 (変更なし) */}
        {sortedEvents.map((event) => {
          
          const calculatedY = eventYCoordinates.get(event.id) || 0; 
          const eventX = getEventX(event); 

          const isCurrentlyEditingThis = isEditing && editingEventId === event.id;

          return (
            <div
              key={event.id}
              className={`absolute -translate-y-1/2 z-10
                         ${isCurrentlyEditingThis ? 'w-full max-w-[280px]' : ''}`}
              style={{ 
                top: `${calculatedY}px`, 
                left: `${eventX}px`, 
                transform: 'translateX(-50%)' 
              }} 
            >
              {isCurrentlyEditingThis ? (
                // (A) 編集フォーム
                <div className="p-2 bg-white border-2 border-blue-500 rounded shadow-lg">
                  <input type="number" name="age" value={editFormData.age} onChange={handleEditFormChange} className="w-16 p-1 border rounded mb-1 text-sm"/>
                  <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} className="w-full p-1 border rounded mb-2 text-sm"/>
                  <div className="flex justify-end gap-2">
                    <button onClick={handleCancelEditing} className="text-xs text-gray-600 hover:text-gray-900">キャンセル</button>
                    <button onClick={handleUpdateSubmit} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">保存</button>
                  </div>
                </div>
              ) : (
                // (B) 通常ボタン
                <div className="flex items-center"> 
                  <button
                    className={`bg-blue-500 text-white 
                               font-bold py-1 px-3 rounded-full text-sm 
                               ${isEditing || isPathEditing ? 'cursor-default' : 'hover:bg-blue-700'} 
                               whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]`} 
                    title={`${event.age}歳: ${event.title}`} 
                    onClick={() => !isEditing && !isPathEditing && onAgeEventClick(event)}
                  >
                    {event.age}歳: {event.title}
                  </button>
                  {/* 編集ボタン */}
                  {isEditing && (
                    <div className="ml-2 flex gap-1 flex-shrink-0">
                      <button onClick={() => handleStartEditing(event)} className="p-1 bg-yellow-400 rounded text-xs hover:bg-yellow-500">編集</button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`「${event.title}」を削除しますか？\n(関連するTodoもすべて削除されます)`)) {
                            onDeleteEvent(event.id);
                          }
                        }}
                        className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
      </div> {/* 道の描画エリアの閉じタグ */}
    </div> 
  );
};