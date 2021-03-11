import request from "superagent"
import { info, debug, warn, error, verbose } from "./color"

const COLORS: { [key: string]: number } = {

    error: 14362664,
    warn: 16497928,
    info: 2196944,
    verbose: 6559689,
    debug: 47694

}

type Log_Levels = 'error' | 'warn' | 'info' | 'verbose' | 'debug'

interface ErrorCallback {
    (err: Error): void;
  }
  
interface LogMsg {
    message: string
    description?: string
    error?: Error
    json?: any
}

interface LogOptions {
    hookURL: string
    icon?: string
    footer?: string
    console?: boolean
    errorHandler?: { (err: Error): void }; 
}

export class DiscordConsoleLogger {
    private hook: string
    private icon: string | undefined = undefined;
    private footer: string | undefined = undefined;
    private id: string | undefined = undefined;
    private token: string | undefined = undefined;
    private console: boolean;
    private onErrorCallback: ErrorCallback | undefined = undefined;

     /**
   * @param options Discord logger options
   */

  constructor(options: LogOptions) {
    this.hook = options.hookURL;
    this.icon = options.icon;
    this.footer = options.footer;
    this.console = options.console;
    this.onErrorCallback = options.errorHandler;
    this.getToken()
  }

  private logInternalError = (err: Error) => {
    if (this.onErrorCallback) {
      this.onErrorCallback(err);
    } else {
      console.error(err);
    }
  }

  private getToken = async (): Promise<{ id: string; token: string }> => {
    if (!this.id || !this.token) {
      try {
        const response = await request
          .get(this.hook)
          .set('accept', 'json');

        this.id = response.body.id;
        this.token = response.body.token;
      } catch (err) {
        this.logInternalError(err);
      }
    }
    return {
      id: this.id || '',
      token: this.token || ''
    };
  };

  private getUrl = async () => {
    const { id, token } = await this.getToken();
    return `https://discord.com/api/webhooks/${id}/${token}`;
  }

  /**
   * @param level Message log level
   * @param data Log message data
   */
  public log = async (
    level: Log_Levels,
    data: LogMsg
  ) => {
    try {
      const postBody = {
        content: undefined as string | undefined,
        embeds: [{
          title: data.message,
          description: data.description,
          color: COLORS[level],
          fields: [] as any[],
          timestamp: new Date().toISOString(),
          footer: {
            text: this.footer,
            icon_url: this.icon
          }
        }]
      };

      const contentStrings: string[] = [];

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

      await request
        .post(options.url)
        .send(options.body)
        .set('accept', 'json');
    } catch (err) {
      this.logInternalError(err);
    }
  };

  /**
   * @param data Log message data
   */
  public error = async (data: LogMsg) => {
      this.log('error', data);
      if (this.console) {
        error(data.message)
    }
}

  /**
   * @param data Log message data
   */
  public warn = async (data: LogMsg) => { 
      this.log('warn', data);
      if (this.console) {
        warn(data.message)
      }
  }

  /**
   * @param data Log message data
   */
  public info = async (data: LogMsg) => {
      this.log('info', data);
      if (this.console) {
        info(data.message)
    }
  }

  /**
   * @param data Log message data
   */
  public verbose = async (data: LogMsg) => {
      this.log('verbose', data);
      if (this.console) {
        verbose(data.message)
    }
}

  /**
   * @param data Log message data
   */
  public debug = async (data: LogMsg) => { 
      this.log('debug', data);
      if (this.console) {
       debug(data.message)
    } 
  }

}