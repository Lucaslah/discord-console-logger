<h1 align="center">
<p>Discord Console Logger</p>
</h1>
<p align="center">
  A Basic Nodejs logger that logs to a Discord Webhook
  </p>
<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/discord-console-logger">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/lucaslah/discord-console-logger">
  <img alt="NPM" src="https://img.shields.io/npm/l/discord-console-logger">
  <img alt="npm" src="https://img.shields.io/npm/dw/discord-console-logger">
  </p>
  <p align="center">
  <img alt="npmpkg" src="https://nodei.co/npm/discord-console-logger.png" herf="https://npmjs.org/package/discord-console-logger">
  </p>



## Install
- yarn: `yarn add discord-console-logger`
- npm: `npm i discord-console-logger`

## Usage
```javascript
// Import Discord Console Logger
const { DiscordConsoleLogger } = require('discord-console-logger')

// Make a new Logger instance
const logger = new DiscordConsoleLogger({ 
// Full Discord Webhook URL with ID and Token (required)
    hookURL: '',
// Icon to Show in the embed footer (optional)
    icon: '', 
// Footer Text to show on the embed (optional)
    footer: '', 
// Sets if you want discord-console-logger to log to the console as well as your Discord Webhook (optional: default false)
    console: true, 
// Error Handler (optional)
    errorHandler: err => {
        console.error('[DISCORD CONSOLE LOGGER]', err); 
    }
})

```

## Examples
```javascript
logger.warn({ message: "Testing" }) // Log Warn
logger.error({ message: "Testing" }) // Log Error
logger.info({ message: "Testing" }) // Log Info
logger.verbose({ message: "Testing" }) // Log Verbose
logger.debug({ message: "Testing" }) // Log Debug

// Log Error
logger.error({
  message: 'Testing',
  error: new Error('Testing')
})

// Log Json
logger.debug({
  message: 'Testing',
  json: { test: testing }
})

// Log with a Description
logger.info({
  message: 'Testing',
  description: 'More Testing'
})
```

## Log Message 
| Field  | Type  | Description  | Required |
|---|---|---|---|
| message  | string  | Main log message (Embed Title)   |  yes  |
| description  |  string  | Log message description (Embed description)  | no  |
| error  |  Error  | Error to be logged with the log embed  | no  |
| json  |  any | Json that will be logged with the Discord Embed  | no  |
---
