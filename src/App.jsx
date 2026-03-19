import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Stars, Float } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

// ---- Floating particle rings around the cube ----
function ParticleRing({ radius, count, color, speed }) {
  const points = useRef()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    positions[i * 3]     = Math.cos(angle) * radius
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4
    positions[i * 3 + 2] = Math.sin(angle) * radius
  }

  useFrame(({ clock }) => {
    points.current.rotation.y = clock.getElapsedTime() * speed
    points.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} sizeAttenuation />
    </points>
  )
}

// ---- The main cube ----
function NerdyCube() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    meshRef.current.rotation.x += 0.003
    meshRef.current.rotation.y += 0.007
    // Pulse scale on hover
    const scale = hovered
      ? 1 + Math.sin(clock.getElapsedTime() * 6) * 0.03
      : 1
    meshRef.current.scale.setScalar(scale)
  })

  const faces = [
    { position: [0, 0, 1.01],  rotation: [0, 0, 0] },
    { position: [0, 0, -1.01], rotation: [0, Math.PI, 0] },
    { position: [1.01, 0, 0],  rotation: [0, Math.PI / 2, 0] },
    { position: [-1.01, 0, 0], rotation: [0, -Math.PI / 2, 0] },
    { position: [0, 1.01, 0],  rotation: [-Math.PI / 2, 0, 0] },
    { position: [0, -1.01, 0], rotation: [Math.PI / 2, 0, 0] },
  ]

  const labels = [
    'RIMSHA HUSSAIN',    // front
    'B23110006138',     // back
    'HCI & CG',     // right
    'LAB#7: 05(c)',    // left
    'UOK · 2026',   // top
    '{ code:)}',     // bottom
  ]

  const colors = ['#00ffcc', '#ff00ff', '#00ccff', '#ffff00', '#ff6600', '#00ff88']

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color={hovered ? '#0a0a2a' : '#05050f'}
        emissive={hovered ? '#110022' : '#000011'}
        roughness={0.2}
        metalness={0.9}
        wireframe={false}
      />

      {faces.map((face, i) => (
        <Text
          key={i}
          position={face.position}
          rotation={face.rotation}
          fontSize={0.24}
          color={colors[i]}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.008}
          outlineColor="#000033"
          letterSpacing={0.05}
        >
          {labels[i]}
        </Text>
      ))}
    </mesh>
  )
}

// ---- Wireframe ghost cube ----
function WireframeCube() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.004
    ref.current.rotation.y = clock.getElapsedTime() * 0.009
    ref.current.rotation.z = clock.getElapsedTime() * 0.002
  })
  return (
    <mesh ref={ref} scale={1.6}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#00ffcc"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  )
}

// ---- Main App ----
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000008', overflow: 'hidden' }}>

      {/* Top header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
        borderBottom: '1px solid rgba(0,255,204,0.15)',
        background: 'rgba(0,0,8,0.6)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          fontFamily: 'monospace', color: '#00ffcc', fontSize: '12px',
          letterSpacing: '3px', opacity: 0.9,
        }}>
          {'> HCI_LAB_05(c).exe'}
        </div>
        <div style={{
          fontFamily: 'monospace', color: '#ff00ff', fontSize: '11px',
          letterSpacing: '2px', opacity: 0.7,
        }}>
          {'UNIVERSITY OF KARACHI // 2026'}
        </div>
      </div>

      {/* Left side nerdy stats */}
      <div style={{
        position: 'absolute', left: '24px', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'monospace', fontSize: '11px',
        color: 'rgba(0,255,204,0.5)',
        lineHeight: '2',
        zIndex: 10,
        letterSpacing: '1px',
      }}>
        <div>RENDER: WebGL</div>
        <div>LIB: Three.js</div>
        <div>FW: React 18</div>
        <div>FACES: 6</div>
        <div>VERTS: 8</div>
        <div style={{ color: '#ff00ff', marginTop: '8px' }}>■ LIVE</div>
      </div>

      {/* Right side info */}
      <div style={{
        position: 'absolute', right: '24px', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'monospace', fontSize: '11px',
        color: 'rgba(0,200,255,0.5)',
        lineHeight: '2',
        zIndex: 10,
        textAlign: 'right',
        letterSpacing: '1px',
      }}>
        <div>DRAG TO ROTATE</div>
        <div>SCROLL TO ZOOM</div>
        <div>HOVER TO PULSE</div>
        <div style={{ color: '#ffff00', marginTop: '8px' }}>◆ HCI + CG</div>
      </div>

      {/* Bottom footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 24px',
        display: 'flex', justifyContent: 'center', gap: '40px',
        zIndex: 10,
        borderTop: '1px solid rgba(0,255,204,0.1)',
        background: 'rgba(0,0,8,0.6)',
        backdropFilter: 'blur(10px)',
        fontFamily: 'monospace', fontSize: '10px',
        color: 'rgba(0,255,204,0.4)',
        letterSpacing: '3px',
      }}>
        <span>{'{ separation_of_concerns }'}</span>
        <span>{'[ three.js + react ]'}</span>
        <span>{'// lab_05c_complete'}</span>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5.5], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]}   color="#00ffcc" intensity={2} />
        <pointLight position={[-5, -5, -5]} color="#ff00ff" intensity={1.5} />
        <pointLight position={[0, 5, -5]}   color="#0066ff" intensity={1} />
        <pointLight position={[0, -5, 5]}   color="#ffff00" intensity={0.5} />

        {/* Stars background */}
        <Stars radius={100} depth={60} count={5000} factor={4} fade />

        {/* Particle rings */}
        <ParticleRing radius={3.2} count={120} color="#00ffcc" speed={0.3}  />
        <ParticleRing radius={2.8} count={80}  color="#ff00ff" speed={-0.2} />
        <ParticleRing radius={3.6} count={60}  color="#0088ff" speed={0.15} />

        {/* Ghost wireframe */}
        <WireframeCube />

        {/* Main cube — floats gently */}
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
          <NerdyCube />
        </Float>

        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  )
}