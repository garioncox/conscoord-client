export function CombineTime(startTime: string, endTime: string) {
    const _startDate = startTime.split(" ")[0];
    const _startTime = startTime.split(" ")[1];
    const _endTime = endTime.split(" ")[1];

    return `${_startDate} ${_startTime} - ${_endTime}`;
}
