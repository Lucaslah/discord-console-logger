const x = require("../dist/index");
const y = new x.DiscordConsoleLogger({
    console: true,
    hookURL: "https://discord.com/api/webhooks/864415757525450752/d06iqxLH2cfJ_5c0vCClJDEITmBbKezLLA12YgLlcXkyxoMDU3obKtPBX9RScTK25Jfa",
    footer: "Test"
});
y.custom({
    message: "Hello World",
}, {
    color: 0x3498db,
    prefix: '[CUSTOM]'
});