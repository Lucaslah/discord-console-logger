import { LogMsg, CustomLog, LogOptions } from "./interfaces";
declare type Log_Levels = "error" | "warn" | "info" | "verbose" | "debug" | "custom";
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
     * Discord Console Logger
     * @param options Discord logger options
     */
    constructor(options: LogOptions);
    private logInternalError;
    private getToken;
    private getUrl;
    /**
     * @param level Log Level
     * @param data Log message data
     */
    log: (level: Log_Levels, data: LogMsg, customData?: CustomLog) => Promise<void>;
    /**
     * Log error
     * @param data
     * @type {Promise<void>}
     */
    error: (data: LogMsg) => Promise<void>;
    /**
     * Log warn
     * @param data
     * @type {Promise<void>}
     */
    warn: (data: LogMsg) => Promise<void>;
    /**
     * Log info
     * @param data
     * @type {Promise<void>}
     */
    info: (data: LogMsg) => Promise<void>;
    /**
     * Log verbose
     * @param data
     * @type {Promise<void>}
     */
    verbose: (data: LogMsg) => Promise<void>;
    /**
     * Log debug
     * @param data
     * @type {Promise<void>}
     */
    debug: (data: LogMsg) => Promise<void>;
    /**
     * Log Custom
     * @param data
     * @param customData
     * @type {Promise<void>}
     */
    custom: (data: LogMsg, customData: CustomLog) => Promise<void>;
}
export {};
