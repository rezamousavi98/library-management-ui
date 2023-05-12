export const extractErrorMessages = (messages) => {
    let msg = '';
    if (Array.isArray(messages)) {
        msg = messages[0];
    } else {
        msg = messages;
    }
    return msg;
}