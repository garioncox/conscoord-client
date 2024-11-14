export function CombineTime(startTime: string, endTime: string) {
    const _startDate = startTime.split(" ")[0];
    const _startTime = startTime.split(" ")[1];
    const _endTime = endTime.split(" ")[1];

    const _startTimeNoSeconds = _startTime.slice(0, -3);
    const _endTimeNoSeconds = _endTime.slice(0, -3);
    const _startDateNoYear = _startDate.slice(5, 10);

    return `${_startDateNoYear} at ${_startTimeNoSeconds} - ${_endTimeNoSeconds}`;
}
