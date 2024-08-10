import pino from "pino"

import env from "@/config/env/server"

import type { Logger } from "pino"

const logger: Logger =
    env.NODE_ENV === "production"
        ? pino({ level: "warn" })
        : pino({
              transport: {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                  },
              },
              level: "debug",
          })

export default logger
