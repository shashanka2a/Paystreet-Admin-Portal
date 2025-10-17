export function formatDateDDMMYYYY(isoDate: string): string {
  const d = new Date(isoDate);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function formatTime24h(isoTimeOrDate: string, timeZone?: string): string {
  const d = new Date(`1970-01-01T${isoTimeOrDate.length <= 5 ? isoTimeOrDate : '00:00'}`);
  return d.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone });
}

export function convertToTimeZone(dateISO: string, timeZone?: string): { date: string; time: string } {
  const d = new Date(dateISO);
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone });
  const time = d.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone });
  return { date, time };
}


