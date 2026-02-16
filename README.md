# 🦊 LynxDraw

🔗 **Live Demo:** [https://lynx-draw-frontend.onrender.com](https://lynx-draw-frontend.onrender.com/)

LynxDraw is a collaborative, real-time whiteboard and sketching tool inspired by Excalidraw. It allows users to draw shapes, annotate, and collaborate seamlessly with others on a shared canvas — perfect for brainstorming, planning, or just doodling together!

## ✨ Features

- 🎨 Draw shapes (rectangle, ellipse, freehand, and more)
- 🖱 Select, move, and resize objects
- 🧼 Erase and clear canvas
- 🔁 Real-time collaboration using WebSocket
- 💾 Save and load drawings (local or cloud support)
- 🔄 Undo/Redo functionality
- 📱 Responsive design – works on all screen sizes

## 🛠️ Tech Stack

- **Frontend:** Next js , HTML5 Canvas, Typescript, Tailwind CSS
- **Backend (for collaboration):** Node.js, WebSocket (Socket.IO or native)
- **State Management:** Redis (for websocket state management) / Custom canvas class
- **Build Tool:** Webpack (used internally by Next.js)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lynxdraw.git
cd lynxdraw
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3.Start Development Server

```bash
pnpm run dev
```
