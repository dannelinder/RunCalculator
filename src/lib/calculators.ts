export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

export function formatSecondsToMMSS(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function formatSecondsToHHMMSS(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function paceFromTimeDistance(timeStr: string, distance: number): string {
  const timeSec = parseTimeToSeconds(timeStr);
  if (!distance || timeSec === 0) return '';
  const paceSec = timeSec / distance;
  return `${formatSecondsToMMSS(paceSec)} min/unit`;
}

export function timeFromDistancePace(distance: number, paceStr: string): string {
  const parts = paceStr.split(':').map(Number);
  const paceSec = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] || 0;
  if (!distance || paceSec === 0) return '';
  const totalSec = distance * paceSec;
  return formatSecondsToHHMMSS(totalSec);
}

export function distanceFromTimePace(timeStr: string, paceStr: string): number {
  const timeSec = parseTimeToSeconds(timeStr);
  const parts = paceStr.split(':').map(Number);
  const paceSec = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] || 0;
  if (paceSec === 0) return 0;
  return +(timeSec / paceSec).toFixed(2);
}

export function speedFromPace(paceStr: string): string {
  const parts = paceStr.split(':').map(Number);
  const min = parts[0] + (parts[1] || 0) / 60;
  if (!min) return '';
  const speed = 60 / min;
  return speed.toFixed(2); // dot separator
}

export function paceFromSpeed(speedStr: string): string {
  const speed = parseFloat(speedStr.replace(',', '.'));
  if (!speed || speed <= 0) return '';
  const minPerUnit = 60 / speed;
  const min = Math.floor(minPerUnit);
  const sec = Math.round((minPerUnit - min) * 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function riegelPredict(t1Seconds: number, d1: number, d2: number, k = 1.06): number {
  return t1Seconds * Math.pow(d2 / d1, k);
}