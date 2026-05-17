import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { EXERCISE_IMAGES } from '../lib/exercises';
import { C } from '../lib/theme';

export default function ExerciseImage({ name, height = 200, style = {} }) {
  const images = EXERCISE_IMAGES[name] || [];
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState('loading');
  const touchStartX = useRef(null);

  useEffect(() => {
    setIdx(0);
    setStatus(images.length ? 'loading' : 'error');
  }, [name]);

  const src = images[idx];
  const isLineArt = src?.endsWith('.png');
  const multi = images.length > 1;

  function goTo(n) {
    if (n < 0 || n >= images.length) return;
    setIdx(n);
    setStatus('loading');
  }

  return (
    <div style={style}>
      {/* Image frame */}
      <div
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const d = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) goTo(d > 0 ? idx + 1 : idx - 1);
          touchStartX.current = null;
        }}
        style={{
          width: '100%', height, borderRadius: 14, overflow: 'hidden',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isLineArt ? C.bg : '#0f1f18',
          border: `1px solid ${C.cardBorder}`,
        }}
      >
        {/* Placeholder */}
        {status !== 'loaded' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: status === 'loading' ? 0.25 : 0.4 }}>
            <Dumbbell size={36} color={C.accent} />
            {status === 'error' && <span style={{ color: C.muted, fontSize: 12, fontFamily: C.font }}>{name}</span>}
          </div>
        )}

        {src && (
          <img
            key={src}
            src={src}
            alt={`${name} phase ${idx + 1}`}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain',
              padding: isLineArt ? 16 : 0,
              opacity: status === 'loaded' ? 1 : 0,
              transition: 'opacity 0.3s ease',
              filter: isLineArt ? 'invert(1) brightness(0.88)' : 'none',
            }}
          />
        )}

        {/* Arrows + counter (only for multi-image) */}
        {multi && (
          <>
            <button
              onClick={() => goTo(idx - 1)}
              style={{
                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(2,13,10,0.72)', border: `1px solid ${C.cardBorder}`,
                borderRadius: 8, width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: idx > 0 ? 'pointer' : 'default',
                opacity: idx > 0 ? 1 : 0.2, transition: 'opacity 0.15s',
              }}
            >
              <ChevronLeft size={14} color={C.text} />
            </button>
            <button
              onClick={() => goTo(idx + 1)}
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(2,13,10,0.72)', border: `1px solid ${C.cardBorder}`,
                borderRadius: 8, width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: idx < images.length - 1 ? 'pointer' : 'default',
                opacity: idx < images.length - 1 ? 1 : 0.2, transition: 'opacity 0.15s',
              }}
            >
              <ChevronRight size={14} color={C.text} />
            </button>

            <div style={{
              position: 'absolute', bottom: 8, right: 8,
              background: 'rgba(2,13,10,0.72)', borderRadius: 8,
              padding: '3px 9px', fontSize: 11, color: C.muted, fontFamily: C.font,
              letterSpacing: '0.3px',
            }}>
              {idx + 1} / {images.length}
            </div>
          </>
        )}

        {/* Bottom fade */}
        {status === 'loaded' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
            background: `linear-gradient(to bottom, transparent, ${C.bg}88)`,
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Dot indicators */}
      {multi && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 9 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === idx ? C.accent : C.cardBorder,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
