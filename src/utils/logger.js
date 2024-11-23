import dotenv from 'dotenv'; 

dotenv.config();

const logLevel = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'INFO'

const loggerInfo = (message) => {
  if(logLevel === 'INFO' || logLevel === 'DEBUG')
    console.log('[INFO] ' + message);
}

const loggerDebug = (message) => {
  if(logLevel === 'DEBUG')
    console.log('[DEBUG] ' + message);
}

global.loggerInfo = loggerInfo;
global.loggerDebug = loggerDebug;
