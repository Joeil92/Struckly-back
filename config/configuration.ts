import { registerAs } from "@nestjs/config";

export default registerAs("configuration", () => ({
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT as string, 10) || 3000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
}));