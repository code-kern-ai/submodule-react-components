/**
 * Safe logging helpers that use a static format string plus separate arguments.
 * Use these instead of template literals in console.error/log to satisfy
 * unsafe-formatstring: variables are passed as separate arguments, not interpolated
 * into the message string, so format specifier injection cannot forge log output.
 */

/**
 * Log an error with a static message and optional additional arguments.
 * Use for user-facing or variable data so the message string is never attacker-controlled.
 */
export function safeConsoleError(staticMessage: string, ...args: unknown[]): void {
    console.error(staticMessage, ...args);
}
