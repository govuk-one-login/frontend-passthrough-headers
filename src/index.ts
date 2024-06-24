import { logger } from "./utils/logger";
var pjson = require("../package.json");

const metricsObject = {
  packageVersion: pjson.version,
};

const logMessage = () => {
  logger.info(metricsObject);
};

export const frontendVitalsInit = (interval: number) => {
  console.log("process env is", process.env.LOG_LEVEL);

  setInterval(logMessage, interval);
};
