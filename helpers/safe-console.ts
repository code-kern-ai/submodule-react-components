/**
 * Safe console helpers that use constant format strings to avoid format-string
 * injection (CWE-134) when logging variable data. Use these instead of
 * console.error(`message: ${variable}`, ...) so the first argument is always
 * a literal string.
 */

/**
 * Log an error with a constant message and optional details.
 * Use this instead of console.error with interpolated strings.
 */
export function safeConsoleError(fixedMessage: string, ...details: unknown[]): void {
    console.error(fixedMessage, ...details);
}
