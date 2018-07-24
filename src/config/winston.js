var appRoot = require('app-root-path');
var winston = require('winston');

// define the custom settings for transports: file, console
var options ={
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5 MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by 'morgan'
logger.stream = {
  write: function(message) {
    // use the 'info' log level so the output will be picked up both transports (file and console)
    logger.info(message);
  }
};

module.exports = logger;
