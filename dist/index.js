"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const resolveColor_1 = require("./util/resolveColor");
const console_levels_1 = require("./util/console-levels");
const customLogger_1 = __importDefault(require("./custom/customLogger"));
const COLORS = {
    error: 14362664,
    warn: 16497928,
    info: 2196944,
    verbose: 6559689,
    debug: 47694,
};
class DiscordConsoleLogger {
    /**
     * Discord Console Logger
     * @param options Discord logger options
     * @author lucaslah
     */
    constructor(options) {
        this.icon = undefined;
        this.footer = undefined;
        this.id = undefined;
        this.token = undefined;
        this.console = false;
        this.consoleError = false;
        this.onErrorCallback = undefined;
        this.logInternalError = (err) => {
            if (this.onErrorCallback) {
                this.onErrorCallback(err);
            }
            else {
                console.error(err);
            }
        };
        this.getToken = async () => {
            if (!this.id || !this.token) {
                try {
                    const response = await superagent_1.default
                        .get(this.hook)
                        .set('accept', 'json');
                    this.id = response.body.id;
                    this.token = response.body.token;
                }
                catch (err) {
                    this.logInternalError(err);
                }
            }
            return {
                id: this.id || '',
                token: this.token || ''
            };
        };
        this.getUrl = async () => {
            const { id, token } = await this.getToken();
            return `https://discord.com/api/webhooks/${id}/${token}`;
        };
        /**
         * @param level Log Level
         * @param data Log message data
         */
        this.log = async (level, data, customData) => {
            try {
                if (level === "custom" && customData) {
                    const customLogger = new customLogger_1.default({
                        footer: {
                            text: this.footer,
                            icon_url: this.icon
                        }
                    });
                    const cd = {
                        color: customData.color,
                        prefix: customData.prefix
                    };
                    customLogger.sendDiscordData({
                        send: true
                    }, data, cd, await this.getUrl());
                    return;
                }
                const postBody = {
                    content: undefined,
                    /**
                     * Embed Data
                     */
                    embeds: [{
                            /**
                             * Embed Title
                             */
                            title: data.message,
                            /**
                             * Embed description
                             */
                            description: data.description,
                            /**
                             * Embed Color
                             */
                            color: COLORS[level],
                            /**
                             * Embed fields
                             */
                            fields: [],
                            /**
                             * Embed Timestamp
                             */
                            timestamp: new Date().toISOString(),
                            /**
                             * Embed footer
                             */
                            footer: {
                                /**
                                 * Embed footer text
                                 */
                                text: this.footer,
                                /**
                                 * Embed footer Icon
                                 */
                                icon_url: this.icon
                            }
                        }]
                };
                const contentStrings = [];
                if (data.json) {
                    contentStrings.push(JSON.stringify(data.json, undefined, '  '));
                }
                if (data.error && data.error.stack) {
                    contentStrings.push(data.error.stack);
                }
                if (contentStrings.length > 0) {
                    postBody.content = `\`\`\`${contentStrings.join('\n\n')}\`\`\``;
                }
                const options = {
                    url: await this.getUrl(),
                    body: postBody
                };
                await superagent_1.default
                    .post(options.url)
                    .send(options.body)
                    .set('accept', 'json');
            }
            catch (err) {
                this.logInternalError(err);
            }
        };
        /**
         * Log error
         * @param data
         * @type {Promise<void>}
         * @example <logger>.error({ message: "Hello", error: new Error("Test Error") })
         * @public
         */
        this.error = async (data) => {
            this.log('error', data);
            if (this.console) {
                console_levels_1.error(data.message);
                if (this.consoleError) {
                    console.error(data.error);
                }
            }
        };
        /**
         * Log warn
         * @param data
         * @type {Promise<void>}
         * @example <logger>.warn({ message: "Hello" })
         * @public
         */
        this.warn = async (data) => {
            this.log('warn', data);
            if (this.console) {
                console_levels_1.warn(data.message);
            }
        };
        /**
         * Log info
         * @param data
         * @type {Promise<void>}
         * @example <logger>.info({ message: "Hello" })
         * @public
         */
        this.info = async (data) => {
            this.log('info', data);
            if (this.console) {
                console_levels_1.info(data.message);
            }
        };
        /**
         * Log verbose
         * @param data
         * @type {Promise<void>}
         * @example <logger>.verbose({ message: "Hello" })
         * @public
         */
        this.verbose = async (data) => {
            this.log('verbose', data);
            if (this.console) {
                console_levels_1.verbose(data.message);
            }
        };
        /**
         * Log debug
         * @param data
         * @type {Promise<void>}
         * @example <logger>.debug({ message: "Hello" })
         * @public
         */
        this.debug = async (data) => {
            this.log("debug", data);
            if (this.console) {
                console_levels_1.debug(data.message);
            }
        };
        /**
         * Log Custom
         * @param data
         * @param customData
         * @type {Promise<void>}
         * @public
         */
        this.custom = async (data, customData) => {
            this.log("custom", data, customData);
            if (this.console) {
                const _color_ = resolveColor_1.resolveColor(customData.color);
                const prefix = customData.prefix;
                console_levels_1.custom(data.message, prefix);
            }
        };
        this.hook = options.hookURL;
        this.icon = options.iconURL;
        this.footer = options.footer;
        this.console = options.console;
        this.consoleError = options.consoleError;
        this.onErrorCallback = options.errorHandler;
        this.getToken();
    }
}
exports.DiscordConsoleLogger = DiscordConsoleLogger;
