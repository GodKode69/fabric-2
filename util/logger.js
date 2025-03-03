const { colorize, colors } = require("./color");

// Function to get a formatted timestamp
const getTimestamp = () => {
  return new Date().toISOString().replace("T", " ").split(".")[0];
};

// Logging function that prints to the console
const writeLog = (level, message) => {
  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  // Print to console with colors based on log level
  switch (level) {
    case "error":
      console.log(colorize(logMessage, colors.fg.red));
      break;
    case "warn":
      console.log(colorize(logMessage, colors.fg.yellow));
      break;
    case "info":
      console.log(colorize(logMessage, colors.fg.cyan));
      break;
    case "debug":
      console.log(colorize(logMessage, colors.fg.magenta));
      break;
    default:
      console.log(logMessage);
  }
};

// Logger object with different logging methods
const logger = {
  error: (message) => writeLog("error", message),
  warn: (message) => writeLog("warn", message),
  info: (message) => writeLog("info", message),
  debug: (message) => writeLog("debug", message),
};

module.exports = logger;
