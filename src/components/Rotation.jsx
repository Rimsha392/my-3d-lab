import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import { useState } from 'react'
import * as THREE from 'three'

const P = new THREE.Vector3(3, 1, 4)
const theta = Math.PI / 6
const Q = new THREE.Vector3(
  Math.cos(theta) * P.x + Math.sin(theta) * P.z,
  P.y,
  -Math.sin(theta) * P.x + Math.cos(theta) * P.z
)

function Axis({ start, end, color, label, labelPos }) {
  return (
    <>
      <Line points={[start, end]} color={color} lineWidth={1.5} />
      <Text position={labelPos} fontSize={0.18} color={color} anchorX="center">{label}</Text>
    </>
  )
}

function Point3D({ position, color, label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <group position={position}>
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[hovered ? 0.17 : 0.12, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <Text position={[0, 0.3, 0]} fontSize={0.18} color={color} anchorX="center" fontWeight="bold">
        {label}
      </Text>
    </group>
  )
}

function RotationArc() {
  const points = []
  const radius = Math.sqrt(P.x * P.x + P.z * P.z)
  const startAngle = Math.atan2(P.z, P.x)
  for (let i = 0; i <= 20; i++) {
    const angle = (i / 20) * (Math.PI / 6)
    points.push(new THREE.Vector3(
      Math.cos(startAngle + angle) * radius, P.y,
      Math.sin(startAngle + angle) * radius
    ))
  }
  return <Line points={points} color="#ffffff" lineWidth={1} dashed dashSize={0.1} gapSize={0.05} />
}

export default function Rotation({ onBack }) {
  const axisLen = 6
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000010', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(0,255,204,0.2)', background: 'rgba(0,0,16,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #00ffcc44', color: '#00ffcc', padding: '4px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '2px' }}>
            ← BACK
          </button>
          <div style={{ color: '#00ffcc', fontSize: '13px', letterSpacing: '3px' }}>
            {'> 3D_ROTATION — Y-axis 30°'}
          </div>
        </div>
        <div style={{ color: '#888', fontSize: '11px' }}>Rimsha | B23110006138</div>
      </div>

      {/* Info bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.7)' }}>
        <div style={{ flex: 1, padding: '8px 20px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ color: '#00ffcc', fontSize: '10px', letterSpacing: '2px', marginBottom: '2px' }}>● ORIGINAL P</div>
          <div style={{ color: '#aaa', fontSize: '12px' }}>P = (3.000, 1.000, 4.000)</div>
        </div>
        <div style={{ flex: 1, padding: '8px 20px', borderRight: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <div style={{ color: '#ffff00', fontSize: '10px', letterSpacing: '2px', marginBottom: '2px' }}>⟳ Ry(30°)</div>
          <div style={{ color: '#aaa', fontSize: '12px' }}>Y-axis rotation matrix</div>
        </div>
        <div style={{ flex: 1, padding: '8px 20px' }}>
          <div style={{ color: '#ff6b6b', fontSize: '10px', letterSpacing: '2px', marginBottom: '2px' }}>● ROTATED Q</div>
          <div style={{ color: '#aaa', fontSize: '12px' }}>Q = (4.598, 1.000, 1.964)</div>
        </div>
      </div>

      {/* Canvas */}
      <Canvas style={{ flex: 1 }} camera={{ position: [8, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffcc" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
        <Axis start={[-axisLen,0,0]} end={[axisLen,0,0]} color="#ff4444" label="X" labelPos={[axisLen+0.3,0,0]} />
        <Axis start={[0,-axisLen,0]} end={[0,axisLen,0]} color="#44ff44" label="Y" labelPos={[0,axisLen+0.3,0]} />
        <Axis start={[0,0,-axisLen]} end={[0,0,axisLen]} color="#4488ff" label="Z" labelPos={[0,0,axisLen+0.3]} />
        <mesh position={[0,0,0]}><sphereGeometry args={[0.06,8,8]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <gridHelper args={[10, 10, '#333333', '#222222']} />
        <Point3D position={[P.x,P.y,P.z]} color="#00ffcc" label={`P (${P.x}, ${P.y}, ${P.z})`} />
        <Point3D position={[Q.x,Q.y,Q.z]} color="#ff6b6b" label={`Q (${Q.x.toFixed(2)}, ${Q.y.toFixed(2)}, ${Q.z.toFixed(2)})`} />
        <Line points={[[0,0,0],[P.x,P.y,P.z]]} color="#00ffcc" lineWidth={1.5} transparent opacity={0.5} />
        <Line points={[[0,0,0],[Q.x,Q.y,Q.z]]} color="#ff6b6b" lineWidth={1.5} transparent opacity={0.5} />
        <RotationArc />
        <Text position={[3.8,1.3,3.2]} fontSize={0.18} color="#ffffff" anchorX="center">30°</Text>
        <OrbitControls enableZoom={true} />
      </Canvas>

      {/* Footer */}
      <div style={{ padding: '7px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,16,0.9)', display: 'flex', gap: '24px', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px' }}>
        <span style={{ color: '#00ffcc88' }}>● P original</span>
        <span style={{ color: '#ff6b6b88' }}>● Q rotated</span>
        <span>Ry(θ) · P = Q</span>
        <span style={{ marginLeft: 'auto' }}>DRAG TO ORBIT | SCROLL TO ZOOM</span>
      </div>
    </div>
  )
}