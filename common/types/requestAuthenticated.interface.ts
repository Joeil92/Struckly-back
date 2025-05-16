import { Request } from "express";
import { Payload } from "src/auth/types/payload.interface";

export interface RequestAuthenticated extends Request {
    user: Payload
}