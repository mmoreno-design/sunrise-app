const TIME_PATTERNS = [
  { regex: /at (\d{1,2}):(\d{2})\s*(am|pm)?/i, type: 'explicit' },
  { regex: /at (\d{1,2})\s*(am|pm)/i, type: 'hour-only' },
  { regex: /noon/i, type: 'noon' },
  { regex: /midnight/i, type: 'midnight' },
  { regex: /morning/i, type: 'morning' },
  { regex: /afternoon/i, type: 'afternoon' },
  { regex: /evening/i, type: 'evening' },
];

const DATE_PATTERNS = [
  { regex: /tomorrow/i, type: 'tomorrow' },
  { regex: /today/i, type: 'today' },
  { regex: /next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, type: 'next-weekday' },
  { regex: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, type: 'weekday' },
  { regex: /(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/i, type: 'date-slash' },
];

const WEEKDAYS = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

export function parseNaturalEvent(text) {
  const now = new Date();
  let startDate = new Date(now);
  let title = text;
  let hour = 9;
  let minute = 0;

  // Parse date
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern.regex);
    if (!match) continue;

    if (pattern.type === 'tomorrow') {
      startDate.setDate(startDate.getDate() + 1);
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'today') {
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'next-weekday') {
      const targetDay = WEEKDAYS[match[1].toLowerCase()];
      const currentDay = startDate.getDay();
      let daysAhead = targetDay - currentDay + 7;
      if (daysAhead <= 7) daysAhead += 7;
      startDate.setDate(startDate.getDate() + daysAhead);
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'weekday') {
      const targetDay = WEEKDAYS[match[1].toLowerCase()];
      const currentDay = startDate.getDay();
      let daysAhead = targetDay - currentDay;
      if (daysAhead <= 0) daysAhead += 7;
      startDate.setDate(startDate.getDate() + daysAhead);
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'date-slash') {
      startDate = new Date(
        match[3] ? parseInt(match[3]) : now.getFullYear(),
        parseInt(match[1]) - 1,
        parseInt(match[2])
      );
      title = title.replace(match[0], '').trim();
    }
    break;
  }

  // Parse time
  for (const pattern of TIME_PATTERNS) {
    const match = text.match(pattern.regex);
    if (!match) continue;

    if (pattern.type === 'explicit') {
      hour = parseInt(match[1]);
      minute = parseInt(match[2]);
      if (match[3]?.toLowerCase() === 'pm' && hour < 12) hour += 12;
      if (match[3]?.toLowerCase() === 'am' && hour === 12) hour = 0;
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'hour-only') {
      hour = parseInt(match[1]);
      if (match[2]?.toLowerCase() === 'pm' && hour < 12) hour += 12;
      if (match[2]?.toLowerCase() === 'am' && hour === 12) hour = 0;
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'noon') {
      hour = 12; minute = 0;
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'midnight') {
      hour = 0; minute = 0;
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'morning') {
      hour = 9; minute = 0;
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'afternoon') {
      hour = 14; minute = 0;
      title = title.replace(match[0], '').trim();
    } else if (pattern.type === 'evening') {
      hour = 19; minute = 0;
      title = title.replace(match[0], '').trim();
    }
    break;
  }

  startDate.setHours(hour, minute, 0, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  // Clean up title
  title = title.replace(/\s+/g, ' ').replace(/^(with\s+)/i, '').trim();
  if (!title) title = 'New Event';

  return {
    summary: title,
    start: { dateTime: startDate.toISOString() },
    end: { dateTime: endDate.toISOString() },
  };
}
