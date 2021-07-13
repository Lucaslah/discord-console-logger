"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Colors = __importStar(require("chalk"));
exports.resolveColor = (color) => {
    if (typeof color === 'string') {
        if (color === 'RANDOM')
            return Math.floor(Math.random() * (0xffffff + 1));
        if (color === 'DEFAULT')
            return 0;
        // @ts-ignore
        color = Colors[color] || parseInt(color.replace('#', ''), 16);
    }
    else if (Array.isArray(color)) {
        color = (color[0] << 16) + (color[1] << 8) + color[2];
    }
    if (color < 0 || color > 0xffffff)
        throw new RangeError('COLOR_RANGE');
    else if (color && isNaN(color))
        throw new TypeError('COLOR_CONVERT');
    return color;
};
