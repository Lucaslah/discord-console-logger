declare type Log_Levels = 'error' | 'warn' | 'info' | 'verbose' | 'debug';
interface LogMsg {
    message: string;
    description?: string;
    error?: Error;
    json?: any;
}
interface LogOptions {
    hookURL: string;
    icon?: string;
    footer?: string;
    console?: boolean;
    consoleError?: boolean;
    errorHandler?: {
        (err: Error): void;
    };
}
export declare class DiscordConsoleLogger {
    private hook;
    private icon;
    private footer;
    private id;
    private token;
    private console;
    private consoleError;
    private onErrorCallback;
    /**
  * @param options Discord logger options
  */
    constructor(options: LogOptions);
    private logInternalError;
    private getToken;
    private getUrl;
    /**
     * @param level Message log level
     * @param data Log message data
     */
    log: (level: Log_Levels, data: LogMsg) => Promise<void>;
    /**
     * @param data Log message data
     */
    error: (data: LogMsg) => Promise<void>;
    /**
     * @param data Log message data
     */
    warn: (data: LogMsg) => Promise<void>;
    /**
     * @param data Log message data
     */
    info: (data: LogMsg) => Promise<void>;
    /**
     * @param data Log message data
     */
    verbose: (data: LogMsg) => Promise<void>;
    /**
     * @param data Log message data
     */
    debug: (data: LogMsg) => Promise<void>;
}
export {};
