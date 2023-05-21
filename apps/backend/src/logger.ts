import { includes } from "ramda";
import { P, match } from "ts-pattern";
import winston from "winston";
import util from "util";

function inspect(data: unknown) {
  return util.inspect(data, { depth: null, showHidden: false, colors: true });
}

const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  format: combine(
    colorize({ all: true }),
    timestamp(),
    align(),
    printf((info) =>
      match(info)
        .with({ level: P.when(includes("error")) }, (info) =>
          [
            `${info.timestamp} ${info.level} ${info.tag} ${info.message}`,
            `${info.stack}`,
            //
          ].join("\n")
        )
        .with({ level: P.when(includes("debug")) }, (info) =>
          [
            `${info.timestamp} ${info.level} ${info.tag} ${info.message}`,
            info.data && `${inspect(info.data)}`,
          ]
            .filter(Boolean)
            .join("\n")
        )
        .otherwise(
          (info) =>
            `${info.timestamp} ${info.level} ${info.tag} ${info.message}`
        )
    )
  ),
  transports: [new winston.transports.Console()],
});

export default (props: object) => logger.child(props);
