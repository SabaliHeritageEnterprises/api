"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
function validateEnv(config) {
    const isProd = config.NODE_ENV === 'production';
    const required = ['DATABASE_URL'];
    const prodRequired = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
    const missing = [
        ...required,
        ...(isProd ? prodRequired : []),
    ].filter((key) => !config[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}. ` +
            `Copy .env.example to .env and fill them in.`);
    }
    if (isProd) {
        for (const key of prodRequired) {
            const value = String(config[key] ?? '');
            if (value.length < 24) {
                throw new Error(`${key} is too short for production (min 24 chars). Generate with: openssl rand -base64 48`);
            }
        }
    }
    return config;
}
//# sourceMappingURL=env.validation.js.map