export function getEventIcon(title = '') {
  const t = title.toLowerCase();
  if (/lunch|dinner|breakfast|brunch|eat|food|restaurant/.test(t)) return '🍽️';
  if (/call|phone|zoom|facetime|teams|skype/.test(t)) return '📞';
  if (/meeting|meet|standup|sync|review|demo|interview/.test(t)) return '💬';
  if (/birthday|bday/.test(t)) return '🎂';
  if (/flight|travel|airport|trip|vacation|holiday/.test(t)) return '✈️';
  if (/church|chapel|worship|service|mass|prayer|bible/.test(t)) return '⛪';
  if (/school|class|lecture|exam|study|course|lesson/.test(t)) return '📚';
  if (/doctor|appointment|dentist|therapy|clinic|hospital|checkup/.test(t)) return '🏥';
  if (/gym|workout|exercise|yoga|run|swim|sport/.test(t)) return '🏋️';
  if (/funeral|memorial/.test(t)) return '🕊️';
  if (/baptism|baptize/.test(t)) return '💧';
  if (/confirmation/.test(t)) return '✝️';
  if (/rehearsal/.test(t)) return '🎭';
  if (/wedding/.test(t)) return '💒';
  if (/party|celebration|anniversary|graduation/.test(t)) return '🎉';
  if (/coffee|cafe/.test(t)) return '☕';
  if (/deadline|due|submit/.test(t)) return '⏰';
  return '📅';
}

export function getCalendarColor(colorId) {
  const colors = {
    '1': '#AC725E', '2': '#D06B64', '3': '#F83A22', '4': '#FA573C',
    '5': '#FF7537', '6': '#FFAD46', '7': '#42D692', '8': '#16A765',
    '9': '#7BD148', '10': '#B3DC6C', '11': '#FBE983', '12': '#FAD165',
    '13': '#92E1C0', '14': '#9FE1E7', '15': '#9FC6E7', '16': '#4986E7',
    '17': '#9A9CFF', '18': '#B99AFF', '19': '#C2C2C2', '20': '#CABDBF',
    '21': '#CCA6AC', '22': '#F691B2', '23': '#CD74E6', '24': '#A47AE2',
  };
  return colors[colorId] || '#4A90D9';
}
