// src/components/LifePath.tsx

import React, { useState } from 'react'; 
import type { LifeData, AgeEvent, FuturePath } from '../types';
import { AddEventForm } from './AddEventForm.tsx';
import { PathEditPanel } from './PathEditPanel.tsx'; 
// ★ 追加: 道詳細モーダルをインポート
import { PathDetailModal } from './PathDetailModal.tsx';

interface Props {
  lifeData: LifeData;
  onAgeEventClick: (event: AgeEvent) => void;
  isEditing: boolean;
  onAddEvent: (age: number, title: string, pathId: string | null) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (eventId: string, newAge: number, newTitle: string) => void;
  isPathEditing: boolean;
  onAddFuturePath: (title: string, memos: string) => void;
  onDeleteFuturePath: (pathId: string) => void;
  onUpdateFuturePath: (pathId: string, newTitle: string, newMemos: string) => void;
}

// --- 定数 ---
const PATH_WIDTH = 10; 
const PATH_GAP = 200; 
const TOTAL_PATH_WIDTH = PATH_WIDTH + PATH_GAP; 
const YEAR_HEIGHT_PX = 12.5; 
const MIN_EVENT_GAP_PX = 40; 
const BRANCH_OFFSET_PX = 60; 
const SIGN_WIDTH = 140;
const SIGN_HEIGHT = 70;

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

  // ★ 追加: 道詳細モーダル用のstate
  const [selectedPath, setSelectedPath] = useState<FuturePath | null>(null);

  const { currentAge, lifeExpectancy, events, futurePaths } = lifeData;
  
  // --- Y座標の計算 ---
  const sortedEvents = [...events].sort((a, b) => a.age - b.age);
  const eventYCoordinates = new Map<string, number>();
  const lastEventYByPath = new Map<string | null, number>();

  const pastEvents = sortedEvents.filter(e => e.age <= currentAge);
  let lastPastY = -MIN_EVENT_GAP_PX;

  for (const event of pastEvents) {
    const eventY_raw = event.age * YEAR_HEIGHT_PX;
    const calculatedY = Math.max(eventY_raw, lastPastY + MIN_EVENT_GAP_PX);
    eventYCoordinates.set(event.id, calculatedY);
    lastPastY = calculatedY;
    lastEventYByPath.set(null, calculatedY);
  }

  const currentAgeY_raw = currentAge * YEAR_HEIGHT_PX;
  const currentAgeY_visual = Math.max(currentAgeY_raw, lastPastY);
  const branchStartY = currentAgeY_visual + BRANCH_OFFSET_PX;
  const futureEventStartY = branchStartY + 20 + SIGN_HEIGHT + 30;

  const futureEvents = sortedEvents.filter(e => e.age > currentAge);

  for (const event of futureEvents) {
    const trackKey = event.pathId;
    const initialY = (trackKey !== null) ? futureEventStartY - MIN_EVENT_GAP_PX : lastPastY;
    const lastY = lastEventYByPath.get(trackKey) ?? initialY;
    const eventY_raw = event.age * YEAR_HEIGHT_PX;
    let calculatedY = Math.max(eventY_raw, lastY + MIN_EVENT_GAP_PX);
    if (trackKey !== null) {
      calculatedY = Math.max(calculatedY, futureEventStartY);
    }
    eventYCoordinates.set(event.id, calculatedY);
    lastEventYByPath.set(trackKey, calculatedY);
  }

  const maxCalculatedY = Math.max(0, ...Array.from(lastEventYByPath.values()));
  const maxAgeInEvents = Math.max(...events.map(e => e.age), 0);
  const effectiveLifeExpectancy = Math.max(lifeExpectancy, maxAgeInEvents, currentAge);
  const rawViewHeight = effectiveLifeExpectancy * YEAR_HEIGHT_PX;
  const viewHeight = Math.max(rawViewHeight, maxCalculatedY, futureEventStartY + 100) + MIN_EVENT_GAP_PX; 


  // --- X軸の計算 ---
  const numPaths = futurePaths.length;
  const viewWidth = Math.max(360, (numPaths + 1) * TOTAL_PATH_WIDTH + 100); 
  const centerX = viewWidth / 2; 

  const getPathX = (pathIndex: number) => {
    const offset = numPaths === 1 ? 0.5 : (numPaths - 1) / 2;
    return centerX + (pathIndex - offset) * TOTAL_PATH_WIDTH;
  };
  
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

  // --- 編集ハンドラ ---
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

  return (
    // ★ 修正: max-w-md を削除して w-full に。これにより画面幅全体を使えるようになる
    <div className="w-full">
      
      {isEditing && (
        <AddEventForm 
          onAddEvent={onAddEvent}
          futurePaths={futurePaths}
          currentAge={currentAge}
        />
      )}
      
      {isPathEditing && (
        <PathEditPanel 
          futurePaths={futurePaths}
          onAddFuturePath={onAddFuturePath}
          onDeleteFuturePath={onDeleteFuturePath}
          onUpdateFuturePath={onUpdateFuturePath}
        />
      )}

      {/* ★ 追加: 道詳細モーダル */}
      <PathDetailModal 
        isOpen={selectedPath !== null}
        onClose={() => setSelectedPath(null)}
        path={selectedPath}
        onUpdateFuturePath={onUpdateFuturePath}
        onDeleteFuturePath={onDeleteFuturePath}
      />
      
      <div 
        className="relative bg-gray-100 overflow-hidden mx-auto border border-gray-300 overflow-x-auto shadow-inner rounded-lg"
        style={{ width: viewWidth, height: viewHeight }} 
      >
        <svg 
          width={viewWidth} 
          height={viewHeight} 
          className="absolute top-0 left-0"
        >
          {/* 1. 過去の道 */}
          <path 
            d={`M ${centerX},0 V ${branchStartY}`} 
            stroke="#333" 
            strokeWidth={PATH_WIDTH} 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* 2. 未来の道 (分岐なし) */}
          {numPaths === 0 && (
            <path 
              d={`M ${centerX},${branchStartY} V ${viewHeight}`}
              stroke="#999" 
              strokeWidth={PATH_WIDTH} 
              strokeDasharray="15 15" 
              fill="none" 
            />
          )}

          {/* 3. 分岐道と看板 */}
          {futurePaths.map((path, index) => {
            const futurePathX = getPathX(index); 
            return (
              <g key={path.id}>
                <path
                  d={
                    `M ${centerX},${branchStartY} ` + 
                    `H ${futurePathX} ` + 
                    `V ${viewHeight}`
                  } 
                  stroke="#9CA3AF" 
                  strokeWidth={PATH_WIDTH} 
                  strokeDasharray="12 12" 
                  fill="none" 
                  className="transition-all duration-300 hover:stroke-blue-400"
                />

                <foreignObject 
                  x={futurePathX - SIGN_WIDTH / 2} 
                  y={branchStartY + 20} 
                  width={SIGN_WIDTH} 
                  height={SIGN_HEIGHT}
                >
                  <div 
                    className={`w-full h-full bg-white border-l-4 ${index % 2 === 0 ? 'border-blue-500' : 'border-purple-500'} rounded shadow-md p-2 flex flex-col justify-center cursor-pointer hover:bg-blue-50 transition-colors`}
                    // ★ 修正: クリック時に編集モーダルを開く (通常モード時)
                    onClick={() => !isEditing && !isPathEditing && setSelectedPath(path)}
                    title={path.memos}
                  >
                    <div className="font-bold text-gray-800 text-sm text-center leading-tight truncate">
                      {path.title}
                    </div>
                    <div className="text-[10px] text-gray-500 text-center mt-1 line-clamp-2 leading-tight">
                      {path.memos || '(メモなし)'}
                    </div>
                  </div>
                </foreignObject>

                <line 
                  x1={futurePathX} y1={branchStartY} 
                  x2={futurePathX} y2={branchStartY + 20} 
                  stroke="#9CA3AF" strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* 4. イベントボタン */}
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
                // 編集フォーム
                <div className="p-2 bg-white border-2 border-blue-500 rounded shadow-lg">
                  <input type="number" name="age" value={editFormData.age} onChange={handleEditFormChange} className="w-16 p-1 border rounded mb-1 text-sm"/>
                  <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} className="w-full p-1 border rounded mb-2 text-sm"/>
                  <div className="flex justify-end gap-2">
                    <button onClick={handleCancelEditing} className="text-xs text-gray-600 hover:text-gray-900">キャンセル</button>
                    <button onClick={handleUpdateSubmit} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">保存</button>
                  </div>
                </div>
              ) : (
                // 通常ボタン
                <div className="flex items-center"> 
                  <button
                    className={`text-white font-bold py-1 px-3 rounded-full text-sm shadow-md border border-white
                               ${event.age > currentAge ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                               ${isEditing || isPathEditing ? 'cursor-default' : ''} 
                               whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] transition-transform hover:scale-105`} 
                    title={`${event.age}歳: ${event.title}`} 
                    onClick={() => !isEditing && !isPathEditing && onAgeEventClick(event)}
                  >
                    <span className="mr-1 opacity-80 text-xs">{event.age}歳:</span>
                    {event.title}
                  </button>

                  {isEditing && (
                    <div className="ml-2 flex gap-1 flex-shrink-0 animate-fade-in">
                      <button onClick={() => handleStartEditing(event)} className="p-1 bg-yellow-400 rounded text-xs hover:bg-yellow-500 shadow">✏️</button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`「${event.title}」を削除しますか？`)) {
                            onDeleteEvent(event.id);
                          }
                        }}
                        className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 shadow"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};