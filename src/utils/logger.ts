const format = (level: 'info' | 'warn' | 'error', message: string) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  info: (message: string) => {
    console.log(format('info', message));
  },
  warn: (message: string) => {
    console.warn(format('warn', message));
  },
  error: (message: string) => {
    console.error(format('error', message));
  }
};
