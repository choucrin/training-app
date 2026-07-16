import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages(プロジェクトサイト)でも動くよう相対パスでビルドする
export default defineConfig({
  base: './',
  plugins: [react()],
})
