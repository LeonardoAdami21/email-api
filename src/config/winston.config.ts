import * as winston from 'winston';
import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.syslog.levels,
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf((info) => {
          const { timestamp, level, message, ...args } = info;

          return `${timestamp} [${level}]: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
          }`;
        }),
        winston.format.json(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      level: 'info',
      filename: 'application.log',
      dirname: 'logs',
    }),
  ],
};
