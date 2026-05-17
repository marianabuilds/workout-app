import { C } from '../lib/theme';

export default function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: C.bg, flexShrink: 0 }}>
      <span style={{ color: C.text, fontSize: 16, fontWeight: 500, fontFamily: C.font }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill={C.text} fillOpacity="1"/>
          <rect x="4.5" y="5" width="3" height="7" rx="1" fill={C.text} fillOpacity="1"/>
          <rect x="9" y="2" width="3" height="10" rx="1" fill={C.text} fillOpacity="1"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill={C.text} fillOpacity="0.3"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" fill={C.text}/>
          <path d="M4.9 7.1a4.4 4.4 0 0 1 6.2 0" stroke={C.text} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <path d="M2.2 4.4a7.5 7.5 0 0 1 11.6 0" stroke={C.text} strokeWidth="1.2" strokeLinecap="round" fill="none" strokeOpacity="0.5"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke={C.text} strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill={C.text}/>
          <path d="M23 4v4a2 2 0 0 0 0-4z" fill={C.text} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}
