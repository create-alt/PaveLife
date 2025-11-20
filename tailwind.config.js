/** @type {import('tailwindcss').Config} */
export default {
  // ▼▼▼ ここが重要です！ ▼▼▼
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  // ▲▲▲ srcフォルダ内の全ファイルを対象にする記述が必要です ▲▲▲
  
  theme: {
    extend: {},
  },
  plugins: [],
}