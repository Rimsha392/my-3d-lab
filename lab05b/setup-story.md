# Lab 05(b) — React + Three.js Setup Story
**Course:** Human Computer Interaction & Computer Graphics  
**Student:** Rimsha Hussain | **Seat No:** B23110006138 
**Date:** March 2026

---

## What is This Setup?

This document explains my complete development environment for building interactive 3D web applications using **React** (UI framework) and **Three.js** (3D graphics library). I already knew React from previous experience, so this story focuses on how I added Three.js to an existing React workflow.

**Tech Stack:**
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v18+ | JavaScript runtime (already installed) |
| npm | v9+ | Package manager (comes with Node) |
| Vite | latest | Fast build tool / dev server for React |
| React | v18 | UI component framework |
| Three.js | latest | 3D rendering library |
| @react-three/fiber | latest | React renderer for Three.js |
| @react-three/drei | latest | Useful Three.js helpers for React |
| VS Code | latest | Code editor (already installed) |
| Git | latest | Version control (already installed) |

---

## Step 1 — Verify Prerequisites

Before starting, I verified that Node.js, npm, and Git were already working:

```bash
node --version
# Expected output: v18.x.x or higher

npm --version
# Expected output: 9.x.x or higher

git --version
# Expected output: git version 2.x.x
```

**Why Vite instead of Create React App?**  
Vite is significantly faster — it starts the dev server in under 1 second because it uses native ES modules instead of bundling everything upfront. For 3D graphics work where files can be large, this speed matters.

---

## Step 2 — Create a New React Project with Vite

```bash
# Navigate to where I keep my projects
cd Documents/projects

# Create a new React project using Vite
npm create vite@latest my-3d-lab -- --template react

# Move into the project folder
cd my-3d-lab

# Install base React dependencies
npm install
```

**What this created:**
```
my-3d-lab/
├── index.html          ← entry point
├── package.json        ← project config + dependencies
├── vite.config.js      ← Vite configuration
└── src/
    ├── main.jsx        ← React app entry
    ├── App.jsx         ← root component
    └── App.css         ← root styles
```

---

## Step 3 — Install Three.js and React Three Fiber

Three.js alone is very low-level — you have to manually manage render loops, cameras, and scenes. **@react-three/fiber** wraps Three.js into React components, which matches the React way of thinking I already knew.

```bash
# Install Three.js
npm install three

# Install React Three Fiber (React renderer for Three.js)
npm install @react-three/fiber

# Install Drei (collection of useful helpers — cameras, controls, loaders, text, etc.)
npm install @react-three/drei
```

**Why drei?**  
Without drei, adding an orbit control (rotating the camera with mouse) needs ~30 lines of manual Three.js code. With drei it's one line: `<OrbitControls />`. It dramatically reduces boilerplate.

---

## Step 4 — Test the Installation

I created a quick test component to confirm everything was working before building the actual lab:

```jsx
// src/TestScene.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function TestBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  )
}

export default function TestScene() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <TestBox />
      <OrbitControls />
    </Canvas>
  )
}
```

I replaced the default `App.jsx` content with `<TestScene />` and ran:

```bash
npm run dev
```

The browser opened at `http://localhost:5173` and showed a blue rotating cube — **Three.js was working inside React**.

---

## Step 5 — VS Code Extensions Installed

Good tooling reduces errors and improves productivity (HCI principle: error prevention).

| Extension | Purpose |
|-----------|---------|
| ES7+ React/Redux Snippets | Fast component scaffolding |
| Prettier | Auto-format code on save |
| ESLint | Catch JS errors before runtime |
| Three.js Snippets | Autocomplete for Three.js API |
| GitLens | Visual Git history in editor |

**Prettier config** (`.prettierrc` in project root):
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2
}
```

---

## Step 6 — Git Setup for the Project

```bash
# Initialize git (Vite already does this, but if not:)
git init

# Check that .gitignore already excludes node_modules
cat .gitignore
# Should contain: node_modules, dist, .env

# Create repo on GitHub (done via github.com)
# Then link local repo to remote:
git remote add origin https://github.com/Rimsha392/my-3d-lab.git

# First commit
git add .
git commit -m "initial setup: React + Three.js + Drei"
git push -u origin main
```

**Why Git from day one?**  
Version control is not just for teams — for 3D graphics work where bugs can break the whole render, being able to roll back to a working commit is essential.

---

## Step 7 — Understanding the Key Concepts (Three.js vs React)

Since I knew React but not Three.js, I had to map new concepts to familiar ones:

| React concept | Three.js / R3F equivalent |
|---------------|--------------------------|
| `<div>` element | `<mesh>` (a 3D object) |
| CSS styles | `<meshStandardMaterial>` |
| Component props | geometry `args`, material `color`, etc. |
| `useState` | still useState — R3F is React! |
| Event listeners | `onClick`, `onPointerOver` on mesh |
| `useEffect` | `useFrame` (runs every animation frame) |

**The most important insight:**  
`<Canvas>` from `@react-three/fiber` is a React component that creates a Three.js WebGL renderer. Everything inside `<Canvas>` is rendered in 3D, not in the browser DOM. This is why 3D elements don't accept normal CSS.

---

## Step 8 — File Structure I Follow

```
src/
├── components/
│   ├── Scene.jsx        ← Canvas wrapper with lights + camera
│   ├── Cube.jsx         ← The 3D cube component
│   └── Controls.jsx     ← Camera orbit controls
├── hooks/
│   └── useRotation.js   ← Custom hook for rotation logic
├── App.jsx
└── main.jsx
```

This separation mirrors the HCI principle of **Separation of Concerns** — each file has one job.

---

## Problems I Encountered & How I Solved Them

| Problem | Cause | Solution |
|---------|-------|---------|
| Black screen on startup | No lights in the scene | Added `<ambientLight>` and `<directionalLight>` |
| Cube not visible | Camera too far or wrong position | Added `camera={{ position: [0, 0, 5] }}` to `<Canvas>` |
| `useFrame` import error | Imported from wrong package | Import from `@react-three/fiber`, not `three` |
| Texture not loading | Wrong file path | Moved textures into `public/` folder |

---

## Summary

| Step | What I Did |
|------|-----------|
| 1 | Verified Node, npm, Git |
| 2 | Created React project with Vite |
| 3 | Installed three, @react-three/fiber, @react-three/drei |
| 4 | Tested with a simple blue cube |
| 5 | Configured VS Code extensions |
| 6 | Set up Git and pushed to GitHub |
| 7 | Learned R3F concepts by mapping them to React |
| 8 | Organized file structure by separation of concerns |

**Total setup time:** ~20 minutes  
**GitHub repo:** https://github.com/Rimsha392/my-3d-lab

---

*Lab 05(b) — Setup Documentation | HCI & CG | University of Karachi*
