// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // 1. メインコンポーネントをインポート
import './index.css'     // 2. CSSをインポート (Tailwind CSSのスタイルを含む)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* 3. Appコンポーネントを起動 */}
  </React.StrictMode>,
)