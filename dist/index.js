"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const color_1 = require("./color");
const COLORS = {
    error: 14362664,
    warn: 16497928,
    info: 2196944,
    verbose: 6559689,
    debug: 47694
};
class DiscordConsoleLogger {
    /**
  * @param options Discord logger options
  */
    constructor(options) {
        this.icon = undefined;
        this.footer = undefined;
        this.id = undefined;
        this.token = undefined;
        this.console = false;
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
         * @param level Message log level
         * @param data Log message data
         */
        this.log = async (level, data) => {
            try {
                const postBody = {
                    content: undefined,
                    embeds: [{
                            title: data.message,
                            description: data.description,
                            color: COLORS[level],
                            fields: [],
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: this.footer,
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
         * @param data Log message data
         */
        this.error = async (data) => {
            this.log('error', data);
            if (this.console) {
                color_1.error(data.message);
            }
        };
        /**
         * @param data Log message data
         */
        this.warn = async (data) => {
            this.log('warn', data);
            if (this.console) {
                color_1.warn(data.message);
            }
        };
        /**
         * @param data Log message data
         */
        this.info = async (data) => {
            this.log('info', data);
            if (this.console) {
                color_1.info(data.message);
            }
        };
        /**
         * @param data Log message data
         */
        this.verbose = async (data) => {
            this.log('verbose', data);
            if (this.console) {
                color_1.verbose(data.message);
            }
        };
        /**
         * @param data Log message data
         */
        this.debug = async (data) => {
            this.log('debug', data);
            if (this.console) {
                color_1.debug(data.message);
            }
        };
        this.hook = options.hookURL;
        this.icon = options.icon;
        this.footer = options.footer;
        this.console = options.console;
        this.onErrorCallback = options.errorHandler;
        this.getToken();
    }
}
exports.DiscordConsoleLogger = DiscordConsoleLogger;
