// src/initData.ts
import type { LifeData } from './types';

export const INITIAL_LIFE_DATA: LifeData = {
  birthDate: '2006-01-01', 
  currentAge: 18, 
  lifeExpectancy: 80, 
  events: [
    {
      id: 'evt-1',
      age: 16, 
      title: '高校時代',
      todos: [
        { id: 'todo-1', text: '部活を頑張る', isCompleted: true },
        { id: 'todo-2', text: '初めてのバイト', isCompleted: false },
      ],
      pathId: null, // ★追加 (null = 過去の道)
    },
    {
      id: 'evt-2',
      age: 20, 
      title: '大学時代',
      todos: [
        { id: 'todo-3', text: 'プログラミングの勉強', isCompleted: false },
      ],
      pathId: null, // ★追加 (null = 過去の道)
    },
    // ★スケッチにあった「30歳: 起業」を将来の道(path-1)の上に追加する例
    {
      id: 'evt-3',
      age: 30,
      title: '起業',
      todos: [],
      pathId: 'path-1' // ★ 'Aの道' (path-1) に関連付け
    }
  ],
  futurePaths: [
    { 
      id: 'path-1', 
      title: 'Aの道', 
      memos: 'Aの道に進んだ場合のメモ', 
      todos: [] // ★追加
    },
    { 
      id: 'path-2', 
      title: 'Bの道', 
      memos: 'Bの道に進んだ場合のメモ', 
      todos: [] // ★追加
    },
  ],
};