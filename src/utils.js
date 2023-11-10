export function getHourFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.getHours();
}

export function getMinuteFromTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return minutes;
}
