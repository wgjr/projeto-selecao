export const toCents = (value) => {
    const number = parseFloat(String(value));
    if (isNaN(number)) return 0;
    return Math.round(number * 1000);
}

export const fromCents = (value) => {
    return (value / 1000);
}

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(value);
};