import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
// import { AuthService } from 'src/modules/_auth/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/helper/types/index.type';


@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        config: ConfigService,
        // private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('RT_SECRET'),
            ignoreExpiration: false,
            passReqToCallback: true,

        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('Authorization').replace('Bearer ', '');
        // const user = await this.authService.validateRToken(refreshToken, payload.sub, payload.role);
        // if (!user) throw new ForbiddenException('Refresh token malformed');
        return {
            ...payload,
            refreshToken,
        };
    }
}