declare const _default: () => {
    env: string;
    port: number;
    globalPrefix: string;
    corsOrigin: string;
    database: {
        url: string;
    };
    redis: {
        host: string;
        port: number;
    };
    jwt: {
        accessSecret: string;
        accessTtl: number;
        refreshSecret: string;
        refreshTtl: number;
    };
    totp: {
        issuer: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
};
export default _default;
