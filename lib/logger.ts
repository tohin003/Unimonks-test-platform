import pino from 'pino';

// Add contextual structured logging with Pino
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport:
        process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                },
            }
            : undefined,
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
});
