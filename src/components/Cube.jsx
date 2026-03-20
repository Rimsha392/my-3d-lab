import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Stars, Float, useTexture } from '@react-three/drei'
import { useRef, useState } from 'react'

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
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} sizeAttenuation />
    </points>
  )
}

function NerdyCube() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  const textures = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/uv_grid_opengl.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/crate.gif',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/brick_diffuse.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/disturb.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lava/lavatile.jpg',
  ])

  useFrame(({ clock }) => {
    meshRef.current.rotation.x += 0.003
    meshRef.current.rotation.y += 0.007
    const scale = hovered ? 1 + Math.sin(clock.getElapsedTime() * 6) * 0.03 : 1
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
  const labels = ['RIMSHA', 'B23110006138', 'HCI & CG', 'LAB 05(c)', 'UOK · 2026', '{ code }']
  const colors = ['#00ffcc', '#ff00ff', '#00ccff', '#ffff00', '#ff6600', '#00ff88']

  return (
    <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial attach="material-0" map={textures[0]} roughness={0.4} metalness={0.3} />
      <meshStandardMaterial attach="material-1" map={textures[1]} roughness={0.4} metalness={0.3} />
      <meshStandardMaterial attach="material-2" map={textures[2]} roughness={0.4} metalness={0.3} />
      <meshStandardMaterial attach="material-3" map={textures[3]} roughness={0.4} metalness={0.3} />
      <meshStandardMaterial attach="material-4" map={textures[4]} roughness={0.4} metalness={0.3} />
      <meshStandardMaterial attach="material-5" map={textures[5]} roughness={0.4} metalness={0.3} />
      {faces.map((face, i) => (
        <Text key={i} position={face.position} rotation={face.rotation} fontSize={0.24} color={colors[i]} anchorX="center" anchorY="middle" fontWeight="bold" outlineWidth={0.008} outlineColor="#000033" letterSpacing={0.05}>
          {labels[i]}
        </Text>
      ))}
    </mesh>
  )
}

function WireframeCube() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.004
    ref.current.rotation.y = clock.getElapsedTime() * 0.009
  })
  return (
    <mesh ref={ref} scale={1.6}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#00ffcc" wireframe transparent opacity={0.08} />
    </mesh>
  )
}

export default function Cube({ onBack }) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000008', overflow: 'hidden' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20, background: 'transparent', border: '1px solid #00ffcc44', color: '#00ffcc', padding: '6px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '2px' }}>
        ← BACK
      </button>
      <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'monospace', color: '#00ffcc', fontSize: '12px', letterSpacing: '3px', zIndex: 10 }}>
        {'> HCI_LAB_05(c).exe'}
      </div>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]}   color="#00ffcc" intensity={2} />
        <pointLight position={[-5, -5, -5]} color="#ff00ff" intensity={1.5} />
        <pointLight position={[0, 5, -5]}   color="#0066ff" intensity={1} />
        <Stars radius={100} depth={60} count={5000} factor={4} fade />
        <ParticleRing radius={3.2} count={120} color="#00ffcc" speed={0.3} />
        <ParticleRing radius={2.8} count={80}  color="#ff00ff" speed={-0.2} />
        <ParticleRing radius={3.6} count={60}  color="#0088ff" speed={0.15} />
        <WireframeCube />
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
          <NerdyCube />
        </Float>
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  )
}