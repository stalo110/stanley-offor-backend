const format = (level, message) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};
export const logger = {
    info: (message) => {
        console.log(format('info', message));
    },
    warn: (message) => {
        console.warn(format('warn', message));
    },
    error: (message) => {
        console.error(format('error', message));
    }
};
