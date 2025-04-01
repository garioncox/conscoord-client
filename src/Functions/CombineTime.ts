import dayjs from "dayjs";

export function CombineTime(start: string, end: string) {
  const startDate = dayjs(start).format("MM/DD/YYYY");

  const startTime = dayjs(start).format("hh:mm");
  const endTime = dayjs(end).format("hh:mm");

  return `${startDate} @ ${startTime} - ${endTime}`;
}

export function combineTimes(startDate: string, endDate: string) {
  const _startDate = dayjs(startDate).format("HH:mm");
  const _endDate = dayjs(endDate).format("HH:mm");

  return `${_startDate} - ${_endDate}`;
}
