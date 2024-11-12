import { CanActivate, Injectable } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { Observable } from "rxjs";
import { ERROR_MESSAGES } from "../messages";

@Injectable()
export class WsGuard implements CanActivate {
    canActivate(context: any): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient();
        const token = client.handshake?.auth?.token || client.handshake.query.token;
        if (!token) {
            client.emit('error', { message: ERROR_MESSAGES.UNAUTHORIZED });
            return false;
        }
        try {
            const decoded = verify(token, process.env.JWT_SECRET) as any;
            return !!decoded?.userId;
        } catch (ex) {
            console.error('Token verification failed:', ex);
            client.emit('error', { message: ERROR_MESSAGES.UNAUTHORIZED });
            return false;
        }
    }
}
