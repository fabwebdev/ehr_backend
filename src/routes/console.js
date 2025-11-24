import { Command } from 'commander';
import Inspiring from '../utils/inspiring.js';

/**
 * Console Routes
 * 
 * This file is where you may define all of your Closure based console
 * commands. Each function is bound to a command instance allowing a
 * simple approach to interacting with each command's IO methods.
 */

/**
 * Register the inspire command
 * @param {Command} program - The commander program instance
 */
export function registerInspireCommand(program) {
    program
        .command('inspire')
        .description('Display an inspiring quote')
        .action(() => {
            console.log(Inspiring.quote());
        });
}