export const toCents = (value) => {
    const number = parseFloat(String(value));
    if (isNaN(number)) return 0;
    return Math.round(number * 100);
}