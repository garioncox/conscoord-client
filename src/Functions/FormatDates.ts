export function FormatDate(DateInput: string) {
    const date = new Date(DateInput + 'T00:00:00');
    return date.toISOString().split("T")[0].replace(/-/g, '/') +
        ' ' +
        date.toTimeString().split(' ')[0];
}