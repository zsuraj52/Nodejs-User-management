import {createLogger , transports , format } from 'winston';
const { combine, timestamp, printf  } = format;

const myFormat = printf(({ level, message}) => {
    return `[${level}] : ${message}`
})

export const logLevels = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };

export const loggers = createLogger({
        exitOnError: false,
        levels:logLevels,
        format: combine(
            format.colorize(),
            format.simple(),
            timestamp(),
            myFormat),
        transports: [new transports.Console()],
});
