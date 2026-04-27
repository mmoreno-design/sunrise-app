# 🌅 Sunrise Calendar

A progressive web app (PWA) inspired by the classic Sunrise Calendar iPhone app (2013–2016). Built with React + Vite + Tailwind CSS.

## Features

- **Month Strip** — compact horizontal calendar with event dots and weather icons
- **Agenda View** — scrollable daily event list with smart icons, pull-to-refresh
- **Smart Event Icons** — auto-detects lunch, calls, meetings, birthdays, flights, church, school, doctor, etc.
- **Weather** — live weather via Open-Meteo API (no API key required)
- **Google Calendar** — OAuth 2.0 integration, reads all your calendars with color coding
- **New Event** — natural language parsing ("Lunch with Lisa tomorrow at noon") + manual mode
- **PWA** — installable to iPhone home screen, offline support via service worker
- **Dark Mode** — follows system preference

---

## Quick Start

```bash
npm install
npm run dev
```

The app works without Google Calendar (shows a connect screen). To enable calendar sync, follow the setup below.

---

## Google Calendar Setup

### Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **"New Project"** → name it "Sunrise Calendar" → Create
3. Select the new project

### Step 2 — Enable the Google Calendar API

1. Go to **APIs & Services → Library**
2. Search for **"Google Calendar API"** and click Enable

### Step 3 — Set Up OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials" → "OAuth client ID"**
3. Configure the OAuth consent screen if prompted:
   - User type: **External**
   - App name: "Sunrise Calendar"
   - Add scope: `https://www.googleapis.com/auth/calendar`
   - Add your email as a test user
4. Create OAuth client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `https://your-vercel-domain.vercel.app`
5. Copy the **Client ID**

### Step 4 — Add Client ID to .env

Create `.env.local` in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Restart the dev server.

### Step 5 — Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add environment variable: `VITE_GOOGLE_CLIENT_ID`
4. Add your Vercel domain to OAuth authorized origins in Google Cloud Console
5. Deploy

---

## Project Structure

```
src/
  components/
    AgendaView.jsx        Scrollable daily event list with pull-to-refresh
    BottomNav.jsx         Today | Calendar | + | Settings nav bar
    ConnectCalendar.jsx   Onboarding / Google sign-in screen
    EventCard.jsx         Individual event row with icon, time, attendees
    EventDetailModal.jsx  Event detail bottom sheet
    MonthStrip.jsx        Horizontal month calendar with event dots
    NewEventModal.jsx     Create event (smart parse + manual)
    SettingsView.jsx      Settings / account management
    WeatherBar.jsx        Current weather display
  hooks/
    useGoogleCalendar.js  Google Calendar OAuth + CRUD
    useGeolocation.js     Browser geolocation (with fallback)
    useWeather.js         Open-Meteo weather data
  utils/
    dateHelpers.js        Date formatting utilities
    eventIcons.js         Keyword → emoji icon mapping
    naturalLanguageParser.js  Parse descriptions into date/time
public/
  manifest.json           PWA manifest
  sw.js                   Service worker for offline support
```

---

## iPhone Installation

1. Open in **Safari** on iPhone
2. Tap the **Share** button
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**
