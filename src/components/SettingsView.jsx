export default function SettingsView({ isSignedIn, onSignOut, onSignIn, calendars, hasClientId }) {
  const appVersion = '1.0.0';

  const installPromptRef = { current: null };
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      installPromptRef.current = e;
    });
  }

  const handleInstall = () => {
    if (installPromptRef.current) {
      installPromptRef.current.prompt();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-container pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
      </div>

      {/* Account section */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
          Account
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)' }}>
          {isSignedIn ? (
            <>
              <div className="px-4 py-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: 'var(--primary)' }}
                >
                  G
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Google Calendar</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {calendars.length} calendar{calendars.length !== 1 ? 's' : ''} connected
                  </p>
                </div>
              </div>
              <div className="h-px mx-4" style={{ background: '#e8e8e8' }} />
              <button
                onClick={onSignOut}
                className="w-full px-4 py-3 text-left text-sm transition-all active:opacity-70"
                style={{ color: '#DC2626' }}
              >
                Disconnect Google Calendar
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              disabled={!hasClientId}
              className="w-full px-4 py-3 text-left text-sm transition-all active:opacity-70"
              style={{ color: hasClientId ? 'var(--primary)' : 'var(--text-secondary)' }}
            >
              {hasClientId ? 'Connect Google Calendar' : 'Google Client ID not configured'}
            </button>
          )}
        </div>
      </div>

      {/* Calendars */}
      {isSignedIn && calendars.length > 0 && (
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
            My Calendars
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)' }}>
            {calendars.map((cal, i) => (
              <div key={cal.id}>
                {i > 0 && <div className="h-px mx-4" style={{ background: '#e8e8e8' }} />}
                <div className="px-4 py-3 flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: cal.backgroundColor || '#4A90D9' }}
                  />
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{cal.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Install PWA */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
          App
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)' }}>
          <div className="px-4 py-3">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Add to Home Screen
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              On iPhone: tap the Share button in Safari, then "Add to Home Screen"
            </p>
          </div>
          <div className="h-px mx-4" style={{ background: '#e8e8e8' }} />
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Version</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{appVersion}</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--card-bg)' }}>
          <div className="text-3xl mb-2">🌅</div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Sunrise Calendar</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Inspired by the classic Sunrise Calendar app (2013–2016)
          </p>
        </div>
      </div>
    </div>
  );
}
