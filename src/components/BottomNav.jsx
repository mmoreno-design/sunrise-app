export default function BottomNav({ activeTab, onTabChange, onNewEvent }) {
  const tabs = [
    { id: 'today', icon: TodayIcon, label: 'Today' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'new', icon: PlusIcon, label: 'New', action: true },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div
      className="bottom-nav flex-shrink-0 border-t safe-bottom"
      style={{
        background: 'rgba(255,255,255,0.92)',
        borderColor: '#e8e8e8',
      }}
    >
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, icon: Icon, label, action }) => {
          if (action) {
            return (
              <button
                key={id}
                onClick={onNewEvent}
                className="flex flex-col items-center transition-all active:scale-90"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: 'var(--primary)' }}
                >
                  <Icon active={true} />
                </div>
              </button>
            );
          }

          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-0.5 px-4 py-1 transition-all active:scale-90"
            >
              <Icon active={isActive} />
              <span
                className="text-xs"
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '10px',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TodayIcon({ active }) {
  const date = new Date().getDate();
  return (
    <div className="w-6 h-6 relative flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="3" stroke={active ? 'var(--primary)' : '#95A5A6'} strokeWidth="1.8" fill="none"/>
        <path d="M8 2v4M16 2v4M3 9h18" stroke={active ? 'var(--primary)' : '#95A5A6'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      <span
        className="absolute text-center font-bold"
        style={{
          fontSize: '8px',
          color: active ? 'var(--primary)' : '#95A5A6',
          top: '12px',
          left: 0, right: 0,
        }}
      >
        {date}
      </span>
    </div>
  );
}

function CalendarIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="3" stroke={active ? 'var(--primary)' : '#95A5A6'} strokeWidth="1.8" fill="none"/>
      <path d="M8 2v4M16 2v4M3 9h18" stroke={active ? 'var(--primary)' : '#95A5A6'} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="8" cy="14" r="1" fill={active ? 'var(--primary)' : '#95A5A6'}/>
      <circle cx="12" cy="14" r="1" fill={active ? 'var(--primary)' : '#95A5A6'}/>
      <circle cx="16" cy="14" r="1" fill={active ? 'var(--primary)' : '#95A5A6'}/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function SettingsIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={active ? 'var(--primary)' : '#95A5A6'} strokeWidth="1.8"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={active ? 'var(--primary)' : '#95A5A6'} strokeWidth="1.8"/>
    </svg>
  );
}
