"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const COLORS = {
    error: 14362664,
    warn: 16497928,
    info: 2196944,
    verbose: 6559689,
    debug: 47694
};
class DiscordConsoleLogger {
    /**
  * Create a discord console logger instance
  * @param options Discord logger options
  */
    constructor(options) {
        this.icon = undefined;
        this.footer = undefined;
        this.id = undefined;
        this.token = undefined;
        this.onErrorCallback = undefined;
        this.logInternalError = (err) => {
            if (this.onErrorCallback) {
                this.onErrorCallback(err);
            }
            else {
                console.error(err); // eslint-disable-line
            }
        };
        this.getToken = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.id || !this.token) {
                try {
                    const response = yield superagent_1.default
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
        });
        this.getUrl = () => __awaiter(this, void 0, void 0, function* () {
            const { id, token } = yield this.getToken();
            return `https://discord.com/api/webhooks/${id}/${token}`;
        });
        /**
         * Send a log message to discord
         * @param level Message log level
         * @param data Log message data
         */
        this.log = (level, data) => __awaiter(this, void 0, void 0, function* () {
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
                    url: yield this.getUrl(),
                    body: postBody
                };
                yield superagent_1.default
                    .post(options.url)
                    .send(options.body)
                    .set('accept', 'json');
            }
            catch (err) {
                this.logInternalError(err);
            }
        });
        /**
         * @param data Log message data
         */
        this.error = (data) => __awaiter(this, void 0, void 0, function* () { return this.log('error', data); });
        /**
         * @param data Log message data
         */
        this.warn = (data) => __awaiter(this, void 0, void 0, function* () { return this.log('warn', data); });
        /**
         * @param data Log message data
         */
        this.info = (data) => __awaiter(this, void 0, void 0, function* () { return this.log('info', data); });
        /**
         * @param data Log message data
         */
        this.verbose = (data) => __awaiter(this, void 0, void 0, function* () { return this.log('verbose', data); });
        /**
         * @param data Log message data
         */
        this.debug = (data) => __awaiter(this, void 0, void 0, function* () { return this.log('debug', data); });
        this.hook = options.hookURL;
        this.icon = options.icon;
        this.footer = options.footer;
        this.onErrorCallback = options.errorHandler;
        this.getToken();
    }
}
exports.default = DiscordConsoleLogger;
//# sourceMappingURL=index.js.map