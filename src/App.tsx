// src/App.tsx

import { useState } from 'react';
import type { AgeEvent, Todo } from './types'; 
import type {FuturePath, LifeData} from './types.ts';
import { useLocalStorage } from './hooks/useLocalStorage'; // .tsx 
import { INITIAL_LIFE_DATA } from './initData.ts'; // .ts
import { LifePath } from './components/LifePath.tsx'; // .tsx
import { TodoPage } from './components/TodoPage.tsx'; // .tsx

function App() {
  const [lifeData, setLifeData] = useLocalStorage<LifeData>(
    'paveLifeData', 
    INITIAL_LIFE_DATA 
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [isEventEditingMode, setIsEventEditingMode] = useState(false);
  // ★ 要望1: 「道」編集モードの state を追加
  const [isPathEditingMode, setIsPathEditingMode] = useState(false);
  
  const handleAgeEventClick = (event: AgeEvent) => {
    setSelectedEventId(event.id);
  };
  const handleBackToPath = () => {
    setSelectedEventId(null);
  };

  // --- Todo編集ロジック ---
  const updateTodosForEvent = (eventId: string, updatedTodos: Todo[]) => {
    setLifeData(prevLifeData => {
      const newEvents = prevLifeData.events.map(event => {
        if (event.id === eventId) {
          return { ...event, todos: updatedTodos };
        }
        return event; 
      });
      return { ...prevLifeData, events: newEvents };
    });
  };
  const handleAddNewTodo = (eventId: string, todoText: string) => {
    const newTodo: Todo = { id: crypto.randomUUID(), text: todoText, isCompleted: false };
    const currentEvent = lifeData.events.find(e => e.id === eventId);
    if (!currentEvent) return; 
    const updatedTodos = [...currentEvent.todos, newTodo]; 
    updateTodosForEvent(eventId, updatedTodos);
  };
  const handleToggleTodo = (eventId: string, todoId: string) => {
    const currentEvent = lifeData.events.find(e => e.id === eventId);
    if (!currentEvent) return;
    const updatedTodos = currentEvent.todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    updateTodosForEvent(eventId, updatedTodos);
  };
  const handleDeleteTodo = (eventId: string, todoId: string) => {
    const currentEvent = lifeData.events.find(e => e.id === eventId);
    if (!currentEvent) return;
    const updatedTodos = currentEvent.todos.filter(todo => todo.id !== todoId);
    updateTodosForEvent(eventId, updatedTodos);
  };
  const handleUpdateTodoText = (eventId: string, todoId: string, newText: string) => {
    const currentEvent = lifeData.events.find(e => e.id === eventId);
    if (!currentEvent) return;
    const updatedTodos = currentEvent.todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, text: newText }; 
      }
      return todo;
    });
    updateTodosForEvent(eventId, updatedTodos);
  };
  // --- Todo編集ロジックここまで ---

  // --- AgeEvent編集ロジック ---

  // ★ (A) AgeEventの追加 (シグネチャを変更)
  const handleAddEvent = (age: number, title: string, pathId: string | null) => {
    if (title.trim() === '') return; 
    
    setLifeData(prev => {
      const newEvent: AgeEvent = {
        id: crypto.randomUUID(),
        age: age,
        title: title,
        todos: [], 
        pathId: pathId, // ★ 引数で受け取った pathId を設定
      };
      return {
        ...prev,
        events: [...prev.events, newEvent].sort((a, b) => a.age - b.age)
      };
    });
  };

  // (B) AgeEventの削除
  const handleDeleteEvent = (eventId: string) => {
    setLifeData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId)
    }));
  };

  // (C) AgeEventの更新
  const handleUpdateEvent = (eventId: string, newAge: number, newTitle: string) => {
    if (newTitle.trim() === '') return; 

    setLifeData(prev => ({
      ...prev,
      events: prev.events.map(event => {
        if (event.id === eventId) {
          return { ...event, age: newAge, title: newTitle };
        }
        return event;
      }).sort((a, b) => a.age - b.age) 
    }));
  };
  // --- AgeEvent編集ロジックここまで ---

  // (D) FuturePathの追加
  const handleAddFuturePath = (title: string, memos: string) => {
    if (title.trim() === '') return;

    const newPath: FuturePath = {
      id: crypto.randomUUID(),
      title: title,
      memos: memos,
      todos: [], // 道固有のTodo (今はまだ使わない)
    };
    
    setLifeData(prev => ({
      ...prev,
      futurePaths: [...prev.futurePaths, newPath]
    }));
  };

  // (E) FuturePathの削除 (★ロジックを修正)
  const handleDeleteFuturePath = (pathId: string) => {
    setLifeData(prev => ({
      ...prev,
      // この道を削除
      futurePaths: prev.futurePaths.filter(path => path.id !== pathId),
      
      // ★ 修正点: この道に紐づいていたAgeEventを「まとめて削除」する
      // (pathIdが null のイベント、または 削除対象以外の pathId を持つイベントだけ残す)
      events: prev.events.filter(event => event.pathId !== pathId)
    }));
  };

  // (F) FuturePathの更新
  const handleUpdateFuturePath = (pathId: string, newTitle: string, newMemos: string) => {
    if (newTitle.trim() === '') return;
    
    setLifeData(prev => ({
      ...prev,
      futurePaths: prev.futurePaths.map(path => {
        if (path.id === pathId) {
          return { ...path, title: newTitle, memos: newMemos };
        }
        return path;
      })
    }));
  };
  
  // --- FuturePath (道) 編集ロジック (ここまで) ---

  const currentEventData = selectedEventId 
    ? lifeData.events.find(e => e.id === selectedEventId) 
    : null;

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">PaveLife</h1>
      
      {/* 編集モード切替ボタン (2つに分離) */}
      {selectedEventId === null && (
        <div className="mb-4 flex gap-2">
          {/* 1. イベント編集ボタン */}
          <button 
            onClick={() => {
              setIsEventEditingMode(prev => !prev);
              setIsPathEditingMode(false); // 道編集はオフにする
            }}
            className={`px-4 py-2 rounded text-white font-bold
                        ${isEventEditingMode ? 'bg-red-500' : 'bg-indigo-500'}`}
          >
            {isEventEditingMode ? 'イベント編集 終了' : 'イベント（年齢）を追加・編集'}
          </button>
          
          {/* ★ 2. 道編集ボタン */}
          <button
            onClick={() => {
              setIsPathEditingMode(prev => !prev);
              setIsEventEditingMode(false); // イベント編集はオフにする
            }}
            className={`px-4 py-2 rounded text-white font-bold
                        ${isPathEditingMode ? 'bg-red-500' : 'bg-purple-500'}`}
          >
            {isPathEditingMode ? '道（将来）編集 終了' : '道（将来）を追加・編集'}
          </button>
        </div>
      )}
      
      {/* LifePath と TodoPage の表示分岐 */}
      {selectedEventId === null || !currentEventData ? (
        <LifePath 
          lifeData={lifeData} 
          onAgeEventClick={handleAgeEventClick}
          // イベント編集
          isEditing={isEventEditingMode}
          onAddEvent={handleAddEvent} // ★ シグネチャが変わった
          onDeleteEvent={handleDeleteEvent}
          onUpdateEvent={handleUpdateEvent}
          
          // ★ 道編集
          isPathEditing={isPathEditingMode} // ★ 新しい state を渡す
          onAddFuturePath={handleAddFuturePath}
          onDeleteFuturePath={handleDeleteFuturePath}
          onUpdateFuturePath={handleUpdateFuturePath}
        />
      ) : (
        <TodoPage 
          event={currentEventData} 
          onBack={handleBackToPath}
          onAddNewTodo={handleAddNewTodo}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodoText={handleUpdateTodoText}
        />
      )}
    </div>
  );
}

export default App;