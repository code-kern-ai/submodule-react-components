/**
 * Checks if a key is safe to use for object property access to prevent prototype pollution.
 * @param key The key to check
 * @returns true if the key is safe, false otherwise
 */
export function isSafeKey(key: string): boolean {
    return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}

/**
 * Safely gets a value from an object using a key, preventing prototype pollution.
 * @param obj The object to get the value from
 * @param key The key to use
 * @returns The value if the key is safe, undefined otherwise
 */
export function safeGet<T = any>(obj: any, key: string): T | undefined {
    if (!isSafeKey(key)) return undefined;
    return obj?.[key];
}
