export function CombineTime(startTime: string, endTime: string) {
    const _startDate = startTime.split("T")[0];
    const _startTime = startTime.split("T")[1];
    const _endTime = endTime.split("T")[1];

    const _startTimeNoSeconds = _startTime.slice(0, -3);
    const _endTimeNoSeconds = _endTime.slice(0, -3);
    const _startDateNoYear = _startDate.slice(5, 10);

    return `${_startDateNoYear} at ${_startTimeNoSeconds} - ${_endTimeNoSeconds}`;
}

export function combineDates(startDate: string, endDate: string) {
    const _startDate = startDate.split("T")[0];
    const _endDate = endDate.split("T")[0];

    return `${_startDate} - ${_endDate}`;
}

export function combineTimes(startDate: string, endDate: string) {
    const _startDate = startDate.split("T")[1];
    const _endDate = endDate.split("T")[1];

    return `${_startDate} - ${_endDate}`;
}