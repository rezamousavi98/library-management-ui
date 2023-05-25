export const datePipe = (date) => {
    return date ? date.split('T')[0] : '-';
}