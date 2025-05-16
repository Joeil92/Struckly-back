import { registerAs } from "@nestjs/config";

export default registerAs("mailer", () => ({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT as string),
    secure: process.env.MAIL_TLS === 'enabled',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
}));