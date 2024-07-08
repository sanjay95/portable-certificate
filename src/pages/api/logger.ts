import pino from 'pino'
import { logLevel } from 'src/utils/env'

export const logger = pino({
  level: logLevel,
  ...(process.env.NODE_ENV==='development') && { 
    transport: {
      target: 'pino-pretty',
    }
  }
})
