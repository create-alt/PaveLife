// src/types.ts

/**
 * ひとつのTodoタスク
 */
export interface Todo{
  id: string;
  text: string;
  isCompleted: boolean;
}

/**
 * 特定の年齢に紐づくイベント（スケッチの「16歳」「20歳」のボタン）
 */
export interface AgeEvent{
  id: string;
  age: number; // イベントが発生する年齢
  title: string; // イベント名（例: "大学受験", "就職"）
  todos: Todo[]; // このイベントに関連するTodo
  pathId: string | null; // ★追加: nullは「過去の道」。それ以外はFuturePathのID
}

/**
 * 未来の分岐する道（スケッチの点線の道）
 */
export interface FuturePath{
  id: string;
  title: string; // その道の名前（例: "起業する道", "海外移住"）
  memos: string; // その道に関するメモ
  todos: Todo[]; // ★追加: その道固有のTodo
}

/**
 * ユーザーの人生全体のデータ
 */
export interface LifeData{
  birthDate: string; // 'YYYY-MM-DD'形式
  currentAge: number; // 現在年齢（スケッチの「18歳」）
  lifeExpectancy: number; // 人生の終点（スケッチの「80歳」など）
  events: AgeEvent[]; // 人生の中のイベント（ボタン）
  futurePaths: FuturePath[]; // 未来の分岐する道
}