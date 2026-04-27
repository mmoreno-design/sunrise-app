export default function WeatherBar({ weather, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="skeleton w-6 h-6 rounded-full" />
        <div className="skeleton w-16 h-4" />
      </div>
    );
  }

  if (!weather) return null;

  const { current } = weather;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
      <span className="text-base leading-none">{current.icon}</span>
      <span className="font-medium">{current.temp}°F</span>
      <span>{current.label}</span>
    </div>
  );
}
