import { WinstonModuleOptions } from 'nest-winston'
import { format, transports } from 'winston'

const { combine, timestamp, printf, colorize, align } = format

const customFormat = printf((info) => {
  const { timestamp, level, message, ...args } = info
  const ts = (timestamp as string).slice(0, 19).replace('T', ' ')
  return `${ts} [${level}]: ${message} ${
    Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
  }`
})

export default (): WinstonModuleOptions => ({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(colorize({ all: true }), timestamp(), align(), customFormat),
  transports: [
    new transports.Console({
      format: combine(colorize({ all: true }), timestamp(), customFormat),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), customFormat),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), customFormat),
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
})
