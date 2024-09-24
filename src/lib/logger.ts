import env from "@/env"
import { Style, colorize } from "@/lib/utils"
import { format, transports, createLogger as winstonCreateLogger } from "winston"

// TODO: https://www.npmjs.com/package/@opentelemetry/instrumentation-winston

export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
}

interface LoggerMeta {
  [key: string]: unknown
  label?: never
  level?: never
  message?: never
  timestamp?: never
}

export type Logger = {
  [LogLevel.Debug]: (message: string, meta?: LoggerMeta) => void
  [LogLevel.Info]: (message: string, meta?: LoggerMeta) => void
  [LogLevel.Warn]: (message: string, meta?: LoggerMeta) => void
  [LogLevel.Error]: (message: string | Error, meta?: LoggerMeta) => void
}

export function createLogger(label?: string): Logger {
  const winstonFormat = env.LOG_PRETTY
    ? format.combine(format.errors({ stack: true }), format.label({ label }), format.timestamp(), customPrettyPrint)
    : format.combine(format.errors({ stack: true }), format.label({ label }), format.timestamp(), format.json())

  return winstonCreateLogger({
    level: env.LOG_LEVEL,
    format: winstonFormat,
    defaultMeta: { label },
    transports: [new transports.Console()],
  })
}

// Pretty print

const levelColors: Record<string, Style[]> = {
  [LogLevel.Debug]: [Style.CYAN],
  [LogLevel.Info]: [Style.GREEN],
  [LogLevel.Warn]: [Style.YELLOW],
  [LogLevel.Error]: [Style.RED],
}

const customPrettyPrint = format.printf((log) => {
  const { timestamp, label, level, message, ...rest } = log
  return [
    colorize(timestamp, [Style.BOLD]),
    colorize(`(${label})`, [Style.PURPLE]),
    colorize(`${level.toUpperCase()}:`, levelColors[level] || []),
    message,
    colorize(`- ${JSON.stringify(rest, null, 2)}`, [Style.THIN]),
  ].join(" ")
})
