import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserDto } from "src/user/user.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService, 
        private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt_secret')
        });
    }

    async validate(payload: any): Promise<UserDto> {
        try {
            const user: UserDto = await this.userService.findUserById(payload.sub);
            return user;
        } catch(error) {
            throw new NotFoundException();
        }
    }
}