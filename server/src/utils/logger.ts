import pino from "pino";
import dayjs from "dayjs";
// import pinoPretty from "pino-pretty";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      levelFirst: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      colorize: true,
      ignore: "pid,hostname",
    },
  },

  //   base: {
  //     pid: false,
  //   },
  //   timestamp: () => `,"time":${dayjs().format()}`,
});

export default logger;
