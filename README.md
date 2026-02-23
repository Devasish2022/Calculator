# 🧮 Scientific Calculator – React Web App  

<p align="center">
  <a href="https://calccss.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20Website-success?style=for-the-badge" />
  </a>
</p>

---

## 📸 Preview

<p align="center">
  <img width="503" height="799" alt="image" src="https://github.com/user-attachments/assets/c0a0301c-d86d-4c93-ac18-77ce6b797c89" />
</p>

---

## 🚀 Overview  

A modern **Scientific Calculator Web Application** built using **React 18**, featuring a custom math engine, persistent calculation history with swipe gestures, and a sleek Android-inspired dark UI.

This project demonstrates strong frontend engineering skills including:
- Advanced state management with React Hooks  
- Custom algorithm implementation (Shunting-Yard parsing)  
- Smooth UI animations & gesture handling  
- Performance optimization techniques  
- Responsive & accessible design  

Designed to showcase production-ready frontend architecture suitable for a **Software Developer role**.

---

## 🛠 Tech Stack  

- **React 18** (useState, useEffect, useCallback, useRef)  
- **Vanilla CSS (10k+ lines structured styling)**  
- **Lucide-React Icons**  
- **LocalStorage API**  
- Custom-built Math Parsing Engine  

Project Structure:
- `App.jsx` – Main UI & state management  
- `Math.jsx` – Custom expression parser & evaluator  
- `HistoryModal.jsx` – Interactive swipe-enabled modal  
- `index.css` – Complete styling & animations  
- `main.jsx` – React DOM entry point  

---

## ✨ Key Features  

### 🔢 Full Calculator Support  
- Digits, operators (+, −, ×, ÷)  
- Brackets & decimals  
- Keyboard shortcuts (Enter, Backspace, Escape)  

### 🧠 Custom Math Engine  
- Tokenization with unary minus handling  
- Infix → Postfix conversion (Shunting-Yard Algorithm)  
- Safe evaluation with divide-by-zero handling  
- Smart floating precision (`toFixed(10)`)  
- Intelligent input validation (dot & bracket control)  

### 🗂 Persistent History  
- Saves last **50 calculations** in localStorage  
- Includes timestamps  
- Reuse expressions or results instantly  
- Swipe-to-dismiss modal with drag physics (120px threshold)  

### 🎨 UI/UX Excellence  
- Android-inspired dark theme  
- Glassmorphism + neumorphic buttons  
- Button press scale effect (0.94)  
- Hover lift & glow animations  
- Dual display (previous + current expression)  
- Horizontal scroll for long inputs  

---

## ⚡ Performance Optimizations  

- `useCallback` for stable handlers  
- Single optimized keyboard listener  
- CSS-based animations (no unnecessary JS repaints)  
- History auto-truncation (max 50 items)  
- Transform & opacity-based animations for smooth rendering  

---

## 📱 Responsive & Accessible  

- Mobile-first layout (`min(420px, 100%)`)  
- Adaptive typography using `clamp()`  
- Touch + mouse gesture support  
- Semantic structure & accessible controls  

---

## 🧩 Code Quality Highlights  

- Clean modular architecture  
- Descriptive function naming  
- Error-resilient design with graceful fallbacks  
- No external state management libraries  
- Maintainable CSS organization  

---
