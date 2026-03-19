import { useState } from 'react'
import Cube from './components/Cube'
import Rotation from './components/Rotation'
import KeyboardControl from './components/KeyboardControl'

const PROJECTS = [
  {
    id: 'cube',
    week: 'Week 07',
    lab: 'Lab 05(c)',
    title: '3D Rotating Cube',
    desc: 'Personalized rotating cube with cyberpunk aesthetic, particle rings and neon text',
    color: '#00ffcc',
  },
  {
    id: 'rotation',
    week: 'Week 09',
    lab: 'Assignment 3',
    title: '3D Rotation Matrix',
    desc: 'Point P=(3,1,4) rotated 30° about Y-axis — matrix calculation visualized',
    color: '#ff6b6b',
  },
  {
    id: 'keyboard',
    week: 'Week 09',
    lab: 'Assignment 4',
    title: 'Keyboard 3D Control',
    desc: 'Interactive 3D object — keyboard rotation (x/y/z) and translation (arrows)',
    color: '#ffff00',
  },
]

export default function App() {
  const [active, setActive] = useState(null)

  if (active === 'cube')     return <Cube onBack={() => setActive(null)} />
  if (active === 'rotation') return <Rotation onBack={() => setActive(null)} />
  if (active === 'keyboard') return <KeyboardControl onBack={() => setActive(null)} />

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#000010',
      fontFamily: 'monospace',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ color: '#00ffcc', fontSize: '11px', letterSpacing: '6px', marginBottom: '12px', opacity: 0.7 }}>
          UNIVERSITY OF KARACHI · HCI & CG · 2026
        </div>
        <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '2px', fontFamily: 'monospace' }}>
          Rimsha's Lab Portfolio
        </h1>
        <div style={{ color: '#888', fontSize: '12px', marginTop: '8px', letterSpacing: '2px' }}>
          B23110006138
        </div>
      </div>

      {/* Project cards */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', padding: '0 24px' }}>
        {PROJECTS.map(p => (
          <div
            key={p.id}
            onClick={() => setActive(p.id)}
            style={{
              width: '220px',
              border: `1px solid ${p.color}44`,
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              background: `linear-gradient(135deg, ${p.color}11, transparent)`,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${p.color}aa`
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.background = `linear-gradient(135deg, ${p.color}22, transparent)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = `1px solid ${p.color}44`
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = `linear-gradient(135deg, ${p.color}11, transparent)`
            }}
          >
            <div style={{ color: p.color, fontSize: '10px', letterSpacing: '3px', marginBottom: '6px' }}>
              {p.week} · {p.lab}
            </div>
            <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', marginBottom: '10px' }}>
              {p.title}
            </div>
            <div style={{ color: '#888', fontSize: '11px', lineHeight: '1.6' }}>
              {p.desc}
            </div>
            <div style={{ color: p.color, fontSize: '11px', marginTop: '16px', letterSpacing: '2px' }}>
              OPEN →
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '20px', color: '#333', fontSize: '10px', letterSpacing: '3px' }}>
        {'{ react + three.js + hci + cg }'}
      </div>
    </div>
  )
}