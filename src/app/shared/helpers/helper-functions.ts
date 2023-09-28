export function formatToTapDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (months are zero-based) and pad
  const year = date.getFullYear(); // Get full year

  return `${day}${month}${year}`;
}

export function sleep(miliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

export function compare(
  a: number | string,
  b: number | string,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
