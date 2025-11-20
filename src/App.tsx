// src/App.tsx

import { useState } from 'react';
import type { LifeData, AgeEvent, Todo, FuturePath } from './types'; 
import { useLocalStorage } from './hooks/useLocalStorage'; 
import { INITIAL_LIFE_DATA } from './initData.ts'; 
import { LifePath } from './components/LifePath.tsx'; 
import { TodoPage } from './components/TodoPage.tsx'; 
// ★ 追加: 設定モーダルをインポート
import { SettingsModal } from './components/SettingsModal.tsx';

function App() {
  const [lifeData, setLifeData] = useLocalStorage<LifeData>(
    'paveLifeData', 
    INITIAL_LIFE_DATA 
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isEventEditingMode, setIsEventEditingMode] = useState(false);
  const [isPathEditingMode, setIsPathEditingMode] = useState(false);

  // ★ 追加: 設定モーダルの開閉状態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAgeEventClick = (event: AgeEvent) => {
    setSelectedEventId(event.id);
  };
  const handleBackToPath = () => {
    setSelectedEventId(null);
  };

  // --- Todo編集ロジック (変更なし) ---
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

  // --- AgeEvent編集ロジック (変更なし) ---
  const handleAddEvent = (age: number, title: string, pathId: string | null) => {
    if (title.trim() === '') return; 
    setLifeData(prev => {
      const newEvent: AgeEvent = {
        id: crypto.randomUUID(),
        age: age,
        title: title,
        todos: [], 
        pathId: pathId, 
      };
      return {
        ...prev,
        events: [...prev.events, newEvent].sort((a, b) => a.age - b.age)
      };
    });
  };
  const handleDeleteEvent = (eventId: string) => {
    setLifeData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId)
    }));
  };
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

  // --- FuturePath編集ロジック (変更なし) ---
  const handleAddFuturePath = (title: string, memos: string) => {
    if (title.trim() === '') return;
    const newPath: FuturePath = {
      id: crypto.randomUUID(),
      title: title,
      memos: memos,
      todos: [],
    };
    setLifeData(prev => ({
      ...prev,
      futurePaths: [...prev.futurePaths, newPath]
    }));
  };
  const handleDeleteFuturePath = (pathId: string) => {
    setLifeData(prev => ({
      ...prev,
      futurePaths: prev.futurePaths.filter(path => path.id !== pathId),
      events: prev.events.filter(event => event.pathId !== pathId)
    }));
  };
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

  // --- ★ 追加: 設定更新ロジック ---
  const handleUpdateSettings = (newBirthDate: string, newCurrentAge: number, newLifeExpectancy: number) => {
    setLifeData(prev => ({
      ...prev,
      birthDate: newBirthDate,
      currentAge: newCurrentAge,
      lifeExpectancy: newLifeExpectancy
    }));
  };

  const currentEventData = selectedEventId 
    ? lifeData.events.find(e => e.id === selectedEventId) 
    : null;

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50 font-sans text-gray-800 relative">
      
      {/* ★ 追加: 右上の設定アイコン (absolute配置) */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-110 text-gray-600 hover:text-blue-600 z-50"
        title="設定"
      >
        {/* 歯車アイコンSVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* ★ 追加: 設定モーダル */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lifeData={lifeData}
        onUpdateLifeData={handleUpdateSettings}
      />


      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
        PaveLife
      </h1>
      
      {selectedEventId === null && (
        <div className="mb-10 flex flex-wrap justify-center gap-8">
          <button 
            onClick={() => {
              setIsEventEditingMode(prev => !prev);
              setIsPathEditingMode(false); 
            }}
            className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform transform hover:scale-105
                        ${isEventEditingMode 
                          ? 'bg-gray-500 ring-4 ring-gray-200' 
                          : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isEventEditingMode ? 'イベント編集を終了' : '＋ イベント (年齢) 追加'}
          </button>
          
          <button
            onClick={() => {
              setIsPathEditingMode(prev => !prev);
              setIsEventEditingMode(false); 
            }}
            className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform transform hover:scale-105
                        ${isPathEditingMode 
                          ? 'bg-gray-500 ring-4 ring-gray-200' 
                          : 'bg-purple-500 hover:bg-purple-600'}`}
          >
            {isPathEditingMode ? '道編集を終了' : '＋ 道 (将来) 追加'}
          </button>
        </div>
      )}
      
      {selectedEventId === null || !currentEventData ? (
        <LifePath 
          lifeData={lifeData} 
          onAgeEventClick={handleAgeEventClick}
          isEditing={isEventEditingMode}
          onAddEvent={handleAddEvent} 
          onDeleteEvent={handleDeleteEvent}
          onUpdateEvent={handleUpdateEvent}
          isPathEditing={isPathEditingMode} 
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
          // ★ 追加: イベント更新ハンドラを渡す
          onUpdateEvent={handleUpdateEvent}
        />
      )}
    </div>
  );
}

export default App;