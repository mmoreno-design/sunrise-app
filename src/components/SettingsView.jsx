export default function SettingsView({
  isSignedIn, onSignOut, onSignIn, calendars, hasClientId,
  pcoEnabled, setPcoEnabled, pcoOrgName, pcoHasCredentials, pcoError,
}) {
  const appVersion = '1.0.0';

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-container pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
      </div>

      {/* Google Calendar section */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
          Google Calendar
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

      {/* Google Calendars list */}
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

      {/* Planning Center section */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
          Planning Center
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)' }}>
          {!pcoHasCredentials ? (
            <div className="px-4 py-3">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                ⛪ Not configured
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Add <code className="px-1 rounded text-xs" style={{ background: 'rgba(0,0,0,0.08)' }}>VITE_PCO_APP_ID</code> and{' '}
                <code className="px-1 rounded text-xs" style={{ background: 'rgba(0,0,0,0.08)' }}>VITE_PCO_SECRET</code> to your .env.local to connect.
              </p>
            </div>
          ) : (
            <>
              {/* Status row */}
              <div className="px-4 py-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: '#6B4FBB' }}
                >
                  ⛪
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {pcoOrgName || 'Planning Center'}
                  </p>
                  <p className="text-xs" style={{ color: pcoError ? '#DC2626' : '#7ED321' }}>
                    {pcoError ? `Error: ${pcoError.slice(0, 60)}` : 'Connected'}
                  </p>
                </div>
              </div>

              {/* Toggle row */}
              <div className="h-px mx-4" style={{ background: '#e8e8e8' }} />
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Show Planning Center events
                </p>
                <button
                  onClick={() => setPcoEnabled(!pcoEnabled)}
                  className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                  style={{ background: pcoEnabled ? '#6B4FBB' : '#e0e0e0' }}
                  aria-label="Toggle Planning Center events"
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: pcoEnabled ? 'translateX(26px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* App section */}
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
