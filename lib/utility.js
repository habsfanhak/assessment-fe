//To display date as yyyy-MM-DD
export function dateFormatted(date) {
    date = new Date(date)
    return date.toISOString().split('T')[0]
}

export function timestamp() {
    var date = new Date();
    return date.toLocaleString("en-US");
}