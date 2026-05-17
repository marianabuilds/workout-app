import { useState } from 'react'
import Home from './Home'
import Workout from './Workout'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState('forward')

  function navigate(to) {
    if (animating) return
    setDirection(to === 'home' ? 'back' : 'forward')
    setAnimating(true)
    setTimeout(() => {
      setScreen(to)
      setAnimating(false)
    }, 280)
  }

  const slideOut = direction === 'forward' ? 'translate-x-[-100%]' : 'translate-x-[100%]'
  const slideIn  = direction === 'forward' ? 'translate-x-[100%]' : 'translate-x-[-100%]'

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div
        className={`absolute inset-0 transition-transform duration-[280ms] ease-in-out ${animating ? slideOut : 'translate-x-0'}`}
        style={{ overflowY: 'auto' }}
      >
        {screen === 'home'
          ? <Home onNavigate={navigate} />
          : <Workout onNavigate={navigate} />}
      </div>

      {animating && (
        <div
          className={`absolute inset-0 transition-transform duration-[280ms] ease-in-out ${slideIn} translate-x-0`}
          style={{ overflowY: 'auto', animation: `slideIn 280ms ease-in-out forwards` }}
        >
          {screen === 'home'
            ? <Workout onNavigate={navigate} />
            : <Home onNavigate={navigate} />}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: ${direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)'} }
          to   { transform: translateX(0) }
        }
      `}</style>
    </div>
  )
}
