import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export default registerAs("auth", (): JwtModuleOptions => ({
    global: true,
    secret: String(process.env.JWT_SECRET)
}));