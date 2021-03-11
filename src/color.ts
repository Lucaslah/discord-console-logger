import { gray, blueBright, greenBright, red, yellowBright, bold, magenta } from "chalk"

import dayjs from 'dayjs';

function getTime(): string {return dayjs().format('HH:mm:ss'); };

export function info(text:string):void {
	return console.log(`${gray(getTime())} ${bold(blueBright('INFO '))}${text}`);
};
export function debug(text:string):void {
    return console.log(`${gray(getTime())} ${bold(greenBright('DEBUG '))}${text}`);
};
export function warn(text:string):void {
    return console.log(`${gray(getTime())} ${bold(yellowBright('WARNING '))}${text}`);
};
export function error(text:string):void {
    return console.log(`${gray(getTime())} ${bold(red('ERROR '))}${text}`);
};
export function verbose(text:string):void {
    return console.log(`${gray(getTime())} ${bold(magenta('VERBOSE '))}${text}`)
}