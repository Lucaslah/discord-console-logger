"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
class CustomLogger {
    constructor(data) {
        this.data = data;
    }
    getCustomData(customData) {
        return {
            color: customData.color,
            prefix: customData.prefix
        };
    }
    async sendDiscordData({ send }, data, customData, url) {
        if (!send)
            return;
        const postBody = {
            content: undefined,
            /**
             * Embed Data
             */
            embeds: [{
                    /**
                     * Embed Title
                     */
                    title: this.getMsgData(data).message,
                    /**
                     * Embed description
                     */
                    description: this.getMsgData(data).description,
                    /**
                     * Embed Color
                     */
                    color: customData.color,
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
                        text: this.data.footer.text,
                        /**
                         * Embed footer Icon
                         */
                        icon_url: this.data.footer.icon_url
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
            url: await url,
            body: postBody
        };
        await superagent_1.default
            .post(options.url)
            .send(options.body)
            .set('accept', 'json');
    }
    getMsgData(messageData) {
        return {
            description: messageData.description,
            message: messageData.message,
            error: messageData.error,
            json: messageData.json
        };
    }
}
exports.default = CustomLogger;
