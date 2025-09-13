import { User } from "./user.interface";

export interface AuthResponse {
    cookies: any;
    user: User;
    token: string;
}


