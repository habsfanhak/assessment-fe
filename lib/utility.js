//To display date as yyyy-MM-DD
export function dateFormatted(date) {
    date = new Date(date)
    return date.toISOString().split('T')[0]
}