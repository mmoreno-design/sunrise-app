export default function ConnectCalendar({ onConnect, hasClientId, loading }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-16">
      <div className="text-6xl mb-6" role="img">🌅</div>
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
        Sunrise Calendar
      </h1>
      <p className="text-sm text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
        Your intelligent calendar with weather, smart icons, and a beautiful design.
      </p>

      {!hasClientId ? (
        <div className="w-full p-4 rounded-2xl mb-4" style={{ background: '#FFF3CD', border: '1px solid #F5A623' }}>
          <p className="text-sm font-medium mb-1" style={{ color: '#856404' }}>Setup Required</p>
          <p className="text-xs" style={{ color: '#856404' }}>
            Add your Google Client ID to <code className="px-1 rounded" style={{ background: 'rgba(0,0,0,0.1)' }}>.env</code> to connect your calendar.
            See README.md for instructions.
          </p>
        </div>
      ) : null}

      <button
        onClick={onConnect}
        disabled={!hasClientId || loading}
        className="w-full py-4 rounded-2xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm"
        style={{
          background: hasClientId ? 'var(--primary)' : '#e0e0e0',
          color: hasClientId ? '#fff' : 'var(--text-secondary)',
        }}
      >
        {loading ? (
          <div className="ptr-spinner" style={{ borderTopColor: '#fff' }} />
        ) : (
          <>
            <GoogleIcon />
            Connect Google Calendar
          </>
        )}
      </button>

      <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-secondary)' }}>
        Your data stays private. We only read your calendar events.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
      <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 17.1 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2c-7.8 0-14.5 4.3-17.7 10.7z" transform="translate(0, 0.7)"/>
      <path fill="#FBBC05" d="M24 46c5.5 0 10.3-1.8 13.9-4.9l-6.4-5.2C29.6 37.4 27 38 24 38c-6.1 0-10.7-3.1-11.9-8.5H5l-.1 1C8.1 41.5 15.5 46 24 46z" transform="translate(0, -1)"/>
      <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1.3 3.3-4.3 5.7-7.8 6.8l6.4 5.2C40 37.2 45 31 45 24c0-1.3-.2-2.7-.5-4z"/>
    </svg>
  );
}
