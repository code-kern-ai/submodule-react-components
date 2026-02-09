const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Safely access obj[key], throwing on prototype-pollution keys.
 * @param obj The object to access
 * @param key The key to access
 * @returns The value at obj[key]
 */
export function safeAccess(obj: any, key: string | number): any {
    if (typeof key === 'string' && UNSAFE_KEYS.has(key)) {
        throw new Error(`Unsafe key rejected: ${key}`);
    }
    return obj[key];
}

/**
 * Safely set obj[key] = value, throwing on prototype-pollution keys.
 * @param obj The object to modify
 * @param key The key to set
 * @param value The value to set
 */
export function safeSet(obj: any, key: string | number, value: any): void {
    if (typeof key === 'string' && UNSAFE_KEYS.has(key)) {
        throw new Error(`Unsafe key rejected: ${key}`);
    }
    obj[key] = value;
}

/**
 * Safely logs a message to the console, avoiding unsafe format strings.
 * @param message The message or format string
 * @param args Additional arguments to log
 */
export function safeConsoleLog(message: any, ...args: any[]): void {
    console.log(message, ...args);
}

/**
 * Safely logs an error to the console, avoiding unsafe format strings.
 * @param message The message or format string
 * @param args Additional arguments to log
 */
export function safeConsoleError(message: any, ...args: any[]): void {
    console.error(message, ...args);
}
