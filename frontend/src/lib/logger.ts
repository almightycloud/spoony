import debug from 'debug';

debug.enable(process.env.REACT_APP_DEBUG as string);

export type Logger = {
  log: debug.IDebugger;
  begin: (message: string, ...args: unknown[]) => Logger;
  continue: (message: string, ...args: unknown[]) => Logger;
}

function createLogger(namespace: string): Logger {
  return {
    log: debug(`spoony:${namespace}`),
    begin(message, ...args): Logger {
      this.log(`${message}:`, ...args);
      return this;
    },
    continue(message, ...args): Logger {
      this.log(`  - ${message}`, ...args);
      return this;
    },
  };
}

export default createLogger;
