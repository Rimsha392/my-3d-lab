import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function ControlledObject({ rotation, position }) {
  const meshRef = useRef()

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation.x, 0.1)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation.y, 0.1)
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, rotation.z, 0.1)
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position.x, 0.1)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position.y, 0.1)
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, position.z, 0.1)
  })

  return (
    <group ref={meshRef}>
      {/* Main cube — white */}
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Wireframe overlay — dark blue, fully visible */}
      <mesh>
        <boxGeometry args={[1.52, 1.52, 1.52]} />
        <meshStandardMaterial color="#0033cc" wireframe transparent opacity={1} />
      </mesh>

      {/* Face labels */}
      {[
        { pos: [0, 0, 0.77],  rot: [0, 0, 0],          text: 'FRONT',  color: '#0000ff' },
        { pos: [0, 0, -0.77], rot: [0, Math.PI, 0],     text: 'BACK',   color: '#cc0000' },
        { pos: [0.77, 0, 0],  rot: [0, Math.PI/2, 0],   text: 'RIGHT',  color: '#007700' },
        { pos: [-0.77, 0, 0], rot: [0, -Math.PI/2, 0],  text: 'LEFT',   color: '#cc6600' },
        { pos: [0, 0.77, 0],  rot: [-Math.PI/2, 0, 0],  text: 'TOP',    color: '#770077' },
        { pos: [0, -0.77, 0], rot: [Math.PI/2, 0, 0],   text: 'BOTTOM', color: '#005577' },
      ].map((f, i) => (
        <Text key={i} position={f.pos} rotation={f.rot} fontSize={0.18} color={f.color} anchorX="center" anchorY="middle" fontWeight="bold">
          {f.text}
        </Text>
      ))}
    </group>
  )
}

function AxisGizmo() {
  return (
    <group position={[-3.5, -2.5, 0]}>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      <Text position={[1.1, 0, 0]} fontSize={0.22} color="#ff0000">X</Text>

      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#00aa00" />
      </mesh>
      <Text position={[0, 1.1, 0]} fontSize={0.22} color="#00aa00">Y</Text>

      <mesh position={[0, 0, 0.5]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#0055ff" />
      </mesh>
      <Text position={[0, 0, 1.1]} fontSize={0.22} color="#0055ff">Z</Text>
    </group>
  )
}

export default function KeyboardControl({ onBack }) {
  const STEP_ROT = Math.PI / 12
  const STEP_POS = 0.3

  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [lastKey, setLastKey] = useState('')
  const [log, setLog] = useState([])

  const addLog = (msg) => setLog(prev => [msg, ...prev].slice(0, 6))

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      setLastKey(e.key)
      switch (e.key) {
        case 'x': setRotation(r => ({ ...r, x: r.x + STEP_ROT })); addLog('x → rotate +X (pitch up)'); break
        case 'X': setRotation(r => ({ ...r, x: r.x - STEP_ROT })); addLog('X → rotate -X (pitch down)'); break
        case 'y': setRotation(r => ({ ...r, y: r.y + STEP_ROT })); addLog('y → rotate +Y (yaw left)'); break
        case 'Y': setRotation(r => ({ ...r, y: r.y - STEP_ROT })); addLog('Y → rotate -Y (yaw right)'); break
        case 'z': setRotation(r => ({ ...r, z: r.z + STEP_ROT })); addLog('z → rotate +Z (roll left)'); break
        case 'Z': setRotation(r => ({ ...r, z: r.z - STEP_ROT })); addLog('Z → rotate -Z (roll right)'); break
        case 'ArrowLeft':  case 'a': e.preventDefault(); setPosition(p => ({ ...p, x: p.x - STEP_POS })); addLog('← → translate -X'); break
        case 'ArrowRight': case 'd': e.preventDefault(); setPosition(p => ({ ...p, x: p.x + STEP_POS })); addLog('→ → translate +X'); break
        case 'ArrowUp':    case 'w': e.preventDefault(); setPosition(p => ({ ...p, y: p.y + STEP_POS })); addLog('↑ → translate +Y'); break
        case 'ArrowDown':  case 's': e.preventDefault(); setPosition(p => ({ ...p, y: p.y - STEP_POS })); addLog('↓ → translate -Y'); break
        case 'f': setPosition(p => ({ ...p, z: p.z + STEP_POS })); addLog('f → translate +Z'); break
        case 'b': setPosition(p => ({ ...p, z: p.z - STEP_POS })); addLog('b → translate -Z'); break
        case 'r': case 'R':
          setRotation({ x: 0, y: 0, z: 0 })
          setPosition({ x: 0, y: 0, z: 0 })
          addLog('R → reset to origin')
          break
        default: break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f0f0f0', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #cccccc', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #0033cc', color: '#0033cc', padding: '4px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '2px' }}>
            ← BACK
          </button>
          <div style={{ color: '#0033cc', fontSize: '13px', letterSpacing: '3px' }}>
            {'> KEYBOARD_3D_CONTROL — Assignment 4'}
          </div>
        </div>
        <div style={{ color: '#555', fontSize: '11px' }}>Rimsha | B23110006138</div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Canvas */}
        <Canvas style={{ flex: 1, background: '#f0f0f0' }} camera={{ position: [0, 0, 6], fov: 55 }}>
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#aaaaff" />
          {/* Visible grid — dark lines on white */}
          <gridHelper args={[10, 10, '#888888', '#bbbbbb']} />
          <ControlledObject rotation={rotation} position={position} />
          <AxisGizmo />
          <OrbitControls enableZoom={true} />
        </Canvas>

        {/* Right panel — light theme */}
        <div style={{ width: '240px', background: '#ffffff', borderLeft: '2px solid #dddddd', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>

          {/* Current state */}
          <div>
            <div style={{ color: '#0033cc', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>CURRENT STATE</div>
            <div style={{ fontSize: '11px', lineHeight: '2', color: '#333' }}>
              <div>rot.x <span style={{ color: '#ff0000', fontWeight: 'bold' }}>{(rotation.x * 180 / Math.PI).toFixed(1)}°</span></div>
              <div>rot.y <span style={{ color: '#00aa00', fontWeight: 'bold' }}>{(rotation.y * 180 / Math.PI).toFixed(1)}°</span></div>
              <div>rot.z <span style={{ color: '#0055ff', fontWeight: 'bold' }}>{(rotation.z * 180 / Math.PI).toFixed(1)}°</span></div>
              <div style={{ marginTop: '4px' }}>pos.x <span style={{ color: '#ff0000', fontWeight: 'bold' }}>{position.x.toFixed(2)}</span></div>
              <div>pos.y <span style={{ color: '#00aa00', fontWeight: 'bold' }}>{position.y.toFixed(2)}</span></div>
              <div>pos.z <span style={{ color: '#0055ff', fontWeight: 'bold' }}>{position.z.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Last key */}
          <div>
            <div style={{ color: '#cc6600', fontSize: '10px', letterSpacing: '3px', marginBottom: '6px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>LAST KEY</div>
            <div style={{ background: '#fff8e1', border: '2px solid #cc6600', borderRadius: '6px', padding: '8px', textAlign: 'center', color: '#cc6600', fontSize: '20px', fontWeight: 'bold' }}>
              {lastKey || '—'}
            </div>
          </div>

          {/* Action log */}
          <div>
            <div style={{ color: '#770077', fontSize: '10px', letterSpacing: '3px', marginBottom: '6px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>ACTION LOG</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {log.length === 0 && <div style={{ color: '#aaa', fontSize: '11px' }}>press a key...</div>}
              {log.map((l, i) => (
                <div key={i} style={{ color: i === 0 ? '#111111' : '#aaaaaa', fontSize: '10px', letterSpacing: '1px' }}>
                  {'>'} {l}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div>
            <div style={{ color: '#005577', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>CONTROLS</div>
            <div style={{ fontSize: '10px', lineHeight: '1.9', color: '#555' }}>
              <div style={{ color: '#999', marginBottom: '4px' }}>— ROTATION —</div>
              <div><span style={{ color: '#0033cc', fontWeight: 'bold' }}>x/X</span> → ±X axis (pitch)</div>
              <div><span style={{ color: '#0033cc', fontWeight: 'bold' }}>y/Y</span> → ±Y axis (yaw)</div>
              <div><span style={{ color: '#0033cc', fontWeight: 'bold' }}>z/Z</span> → ±Z axis (roll)</div>
              <div style={{ color: '#999', margin: '4px 0' }}>— TRANSLATION —</div>
              <div><span style={{ color: '#cc6600', fontWeight: 'bold' }}>← → / a d</span> → X axis</div>
              <div><span style={{ color: '#cc6600', fontWeight: 'bold' }}>↑ ↓ / w s</span> → Y axis</div>
              <div><span style={{ color: '#cc6600', fontWeight: 'bold' }}>f / b</span> → Z axis</div>
              <div style={{ color: '#999', margin: '4px 0' }}>— OTHER —</div>
              <div><span style={{ color: '#cc0000', fontWeight: 'bold' }}>R</span> → reset to origin</div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '7px 20px', borderTop: '1px solid #cccccc', background: '#ffffff', display: 'flex', gap: '24px', fontSize: '10px', color: '#999', letterSpacing: '2px' }}>
        <span>6 DOF control — 3 rotation + 3 translation</span>
        <span style={{ marginLeft: 'auto' }}>SMOOTH LERP INTERPOLATION ACTIVE</span>
      </div>
    </div>
  )
}